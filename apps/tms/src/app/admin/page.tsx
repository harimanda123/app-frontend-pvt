import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@qubere/db";
import { getAccountContext } from "@qubere/auth";
import { TmsAdminWorkbenchClient } from "./TmsAdminWorkbenchClient";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const context = await getAccountContext();
  const currentAccount = context?.accountId
    ? await db.account.findUnique({ where: { id: context.accountId } }).catch(() => null)
    : null;

  const [
    allAccounts,
    agentDecisionCount,
    openExceptionCount,
    carrierInvoiceCount,
    decisionGroups,
    usageSurfaceGroups,
  ] = await Promise.all([
    db.account.findMany({ take: 20, orderBy: { createdAt: "desc" } }).catch(() => []),
    db.agentDecision.count().catch(() => 0),
    db.exceptionItem.count({ where: { status: "Open" } }).catch(() => 0),
    db.carrierInvoice.count().catch(() => 0),
    db.agentDecision.groupBy({ by: ["agentName"], _count: { id: true } }).catch(() => []),
    db.aiUsageWindow.groupBy({
      by: ["surface"],
      where: { windowKind: "day" },
      _sum: { requests: true, inputTokens: true, outputTokens: true },
    }).catch(() => []),
  ]);

  const initialAccounts = allAccounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    status: a.status,
    createdAt: new Date(a.createdAt).toLocaleDateString(),
    dataMode: (a.dataMode as any) || "PRODUCTION",
  }));

  const invocationsByAgent = decisionGroups.map((g) => ({
    agentName: g.agentName,
    invocations: g._count.id,
  }));

  const usageBySurface = usageSurfaceGroups.map((u) => {
    const input = u._sum.inputTokens ? Number(u._sum.inputTokens) : 0;
    const output = u._sum.outputTokens ? Number(u._sum.outputTokens) : 0;
    return {
      surface: u.surface,
      requests: u._sum.requests ?? 0,
      inputTokens: input,
      outputTokens: output,
      totalTokens: input + output,
    };
  });

  const totalTokensSpent = usageBySurface.reduce((acc, curr) => acc + curr.totalTokens, 0);
  const totalInvocations = agentDecisionCount;

  return (
    <TmsAdminWorkbenchClient
      currentAccount={
        currentAccount
          ? {
              id: currentAccount.id,
              name: currentAccount.name,
              dataMode: (currentAccount.dataMode as any) || "PRODUCTION",
            }
          : undefined
      }
      initialAccounts={initialAccounts}
      telemetry={{
        agentDecisionCount,
        openExceptionCount,
        carrierInvoiceCount,
        totalTokensSpent,
        totalInvocations,
        invocationsByAgent,
        usageBySurface,
      }}
    />
  );
}
