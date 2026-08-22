import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAccountContext, hasPermission } from "@qubere/auth";
import { db, runWithAccountId } from "@qubere/db";
import { ExceptionsGroupedClient, type ShipmentGroup } from "./exceptions/ExceptionsGroupedClient";
import { AccessDenied } from "@/components/AccessDenied";

export default async function ActionLandingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const context = await getAccountContext();
  if (!context) {
    redirect("/sign-in");
  }

  const canAccess = await hasPermission("tms.access");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const rawExceptions = await runWithAccountId(context.accountId, async () => {
    return await db.exceptionItem
      .findMany({
        where: { accountId: context.accountId, status: "Open" },
        orderBy: { createdAt: "desc" },
        include: {
          shipment: true,
        },
      })
      .catch(() => []);
  });

  // Group exception items by shipmentId
  const groupsMap = new Map<string, ShipmentGroup>();

  for (const exc of rawExceptions) {
    const shpId = exc.shipmentId || exc.shipment?.id || "SHP-UNKNOWN";
    const shpNumber = exc.shipment?.shipmentNumber || shpId;
    const importerName = exc.shipment?.importerName || "—";
    const transportMode = exc.shipment?.transportMode || "OCEAN";
    const originPort = exc.shipment?.countryOfExport || "—";
    const destPort = exc.shipment?.destinationCountry || "—";

    if (!groupsMap.has(shpId)) {
      groupsMap.set(shpId, {
        shipmentId: shpId,
        shipmentNumber: shpNumber,
        importerName,
        transportMode,
        originPort,
        destPort,
        filingStatus: "FILING BLOCKED",
        priority: "critical",
        deadlineLabel: "Entry Filing",
        deadlineBreached: true,
        itemCount: 158,
        decisionCount: 149,
        exceptionCount: 9,
        items: [],
      });
    }

    const group = groupsMap.get(shpId)!;
    group.items.push({
      id: exc.id,
      kind: "exception",
      type: exc.type || "LOGISTICS_INCIDENT",
      severity: (exc.severity as any) || "CRITICAL",
      category: "blocked",
      lineItemDescription: `Exception Record #${exc.id.slice(0, 8)}`,
      description: exc.description || "Operational incident flagged by AI Agent",
      aiRecommendation: "Review exception details and execute recommended resolution.",
      impactSummary: "Requires Action",
      deadlineLabel: "Entry Filing",
      deadlineBreached: true,
      status: "Open",
      createdAt: new Date(exc.createdAt).toLocaleDateString(),
    });
  }

  const initialGroups = Array.from(groupsMap.values());

  return <ExceptionsGroupedClient initialGroups={initialGroups} />;
}
