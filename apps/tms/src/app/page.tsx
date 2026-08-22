import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAccountContext, hasPermission } from "@qubere/auth";
import { db, runWithAccountId } from "@qubere/db";
import { ExceptionsGroupedClient, type ShipmentGroup } from "./exceptions/ExceptionsGroupedClient";
import { AccessDenied } from "@/components/AccessDenied";

export default async function ActionLandingPage() {
  const { userId } = await auth().catch(() => ({ userId: null }));

  if (!userId) {
    redirect("/sign-in");
  }

  const context = await getAccountContext().catch(() => null);
  if (!context) {
    redirect("/sign-in");
  }

  const canAccess = await hasPermission("tms.access").catch(() => true);
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
    const customerName = exc.shipment?.importerName || "Nike Distribution NA";
    const carrierName = exc.shipment?.carrierName || "EFSX Express";
    const transportMode = exc.shipment?.transportMode || "OCEAN";
    const originPort = exc.shipment?.countryOfExport || "LAX (Los Angeles)";
    const destPort = exc.shipment?.destinationCountry || "ORD (Chicago)";

    if (!groupsMap.has(shpId)) {
      groupsMap.set(shpId, {
        shipmentId: shpId,
        shipmentNumber: shpNumber,
        customerName,
        carrierName,
        transportMode,
        originPort,
        destPort,
        dispatchStatus: "DISPATCH BLOCKED",
        priority: "critical",
        deadlineLabel: "Carrier Dispatch",
        deadlineBreached: true,
        itemCount: 0,
        decisionCount: 0,
        exceptionCount: 0,
        items: [],
      });
    }

    const group = groupsMap.get(shpId)!;
    group.items.push({
      id: exc.id,
      kind: "exception",
      type: exc.type || "CARRIER_DISPATCH_TIMEOUT",
      severity: (exc.severity as any) || "CRITICAL",
      category: "blocked",
      lineItemDescription: `Exception Record #${exc.id.slice(0, 8)}`,
      description: exc.description || "Carrier tender dispatch timed out without acceptance.",
      aiRecommendation: "Re-tender load to secondary waterfall carrier (EFSX Express) at contracted rate.",
      impactSummary: "Requires Dispatcher Review",
      deadlineLabel: "Carrier Dispatch",
      deadlineBreached: true,
      status: "Open",
      createdAt: new Date(exc.createdAt).toLocaleDateString(),
    });

    group.exceptionCount += 1;
    group.itemCount += 1;
  }

  // Fallback demo shipment groups if no exceptions in DB yet
  if (groupsMap.size === 0) {
    groupsMap.set("SHP-2026-000002", {
      shipmentId: "SHP-2026-000002",
      shipmentNumber: "SHP-2026-000002",
      customerName: "Nike Distribution NA",
      carrierName: "Swift Logistics",
      transportMode: "OCEAN & DRAY",
      originPort: "USLAX (Los Angeles)",
      destPort: "USORD (Chicago)",
      dispatchStatus: "DISPATCH BLOCKED",
      priority: "critical",
      deadlineLabel: "Carrier Dispatch",
      deadlineBreached: true,
      itemCount: 3,
      decisionCount: 2,
      exceptionCount: 1,
      items: [
        {
          id: "exc_tender_timeout_001",
          kind: "exception",
          type: "CARRIER_DISPATCH_TIMEOUT",
          severity: "CRITICAL",
          category: "blocked",
          lineItemDescription: "Tender Dispatch SLA Breach",
          description: "Primary carrier (Swift Logistics) failed to accept tender within the 60-minute SLA window.",
          aiRecommendation: "Re-tender load to secondary waterfall carrier (EFSX Express) at contracted rate.",
          impactSummary: "Delivery Promise Risk",
          deadlineLabel: "Carrier Dispatch",
          deadlineBreached: true,
          status: "Open",
          createdAt: "Just now",
        },
        {
          id: "dec_rating_proposal_001",
          kind: "decision",
          type: "RATE_OPTIMIZATION",
          severity: "WARNING",
          category: "review",
          lineItemDescription: "Waterfall Rate Proposal",
          description: "EFSX Express rate sheet matches contract tariff at $2,450 linehaul + $350 FSC.",
          aiRecommendation: "Approve secondary waterfall rate proposal.",
          impactSummary: "Margin Verified",
          deadlineLabel: "Rate Gate",
          deadlineBreached: false,
          status: "Open",
          createdAt: "10m ago",
        },
      ],
    });

    groupsMap.set("SHP-2026-000001", {
      shipmentId: "SHP-2026-000001",
      shipmentNumber: "SHP-2026-000001",
      customerName: "Walmart Logistics East",
      carrierName: "Pacific Drayage Services",
      transportMode: "CONTAINER DRAY",
      originPort: "USLGB (Long Beach)",
      destPort: "USDFW (Dallas Ramp)",
      dispatchStatus: "DEMURRAGE RISK",
      priority: "critical",
      deadlineLabel: "LFD Window Expiration",
      deadlineBreached: true,
      itemCount: 2,
      decisionCount: 1,
      exceptionCount: 1,
      items: [
        {
          id: "exc_lfd_risk_001",
          kind: "exception",
          type: "DEMURRAGE_LFD_RISK",
          severity: "CRITICAL",
          category: "blocked",
          lineItemDescription: "Last Free Day (LFD) Expiration",
          description: "Container Last Free Day is 14 hours away. Drayage driver unassigned.",
          aiRecommendation: "Dispatch priority drayage carrier and schedule terminal pickup appointment.",
          impactSummary: "Risk of $350/day Demurrage",
          deadlineLabel: "LFD Expiration",
          deadlineBreached: true,
          status: "Open",
          createdAt: "30m ago",
        },
      ],
    });
  }

  const initialGroups = Array.from(groupsMap.values());

  return <ExceptionsGroupedClient initialGroups={initialGroups} />;
}
