import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAccountContext, hasPermission } from "@qubere/auth";
import { db, runWithAccountId } from "@qubere/db";
import { TmsSidebar } from "@/components/TmsSidebar";
import { TmsHeader } from "@/components/TmsHeader";
import { AccessDenied } from "@/components/AccessDenied";
import { ReceiptText, Search, CheckCircle2, AlertTriangle, FileCheck2, DollarSign } from "lucide-react";

export default async function InvoicesPage() {
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

  const invoices = await runWithAccountId(context.accountId, async () => {
    return await db.carrierInvoice
      .findMany({
        where: { accountId: context.accountId },
        orderBy: { createdAt: "desc" },
        include: {
          lines: true,
        },
      })
      .catch(() => []);
  });

  return (
    <div className="min-h-screen bg-surface-muted text-ink flex w-full">
      <TmsSidebar accountName="Enterprise Freight" />

      <div className="flex-1 flex flex-col min-w-0">
        <TmsHeader tenantName="Enterprise Freight" userName="Operations Lead" />

        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <ReceiptText className="w-5 h-5 text-brand" />
                <h1 className="text-2xl font-extrabold text-ink tracking-tight">Carrier Invoice 3-Way Reconciliation</h1>
              </div>
              <p className="text-xs text-ink-muted mt-1 font-medium">
                Automated 3-way matching between Quote Buy Rates, Operational Shipments, and Carrier Invoices.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-border shadow-2xs flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search invoices by number, carrier, shipment..."
                className="pl-8 pr-4 py-1.5 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-brand focus:bg-white text-ink w-72 transition-all font-medium"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-ink-muted">Match Status:</span>
                <select className="px-3 py-1.5 bg-surface-muted border border-border rounded-xl text-xs font-semibold text-ink focus:outline-none">
                  <option value="all">All States</option>
                  <option value="MATCHED">MATCHED</option>
                  <option value="DISPUTED">DISPUTED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-2xs">
            {invoices.length === 0 ? (
              <div className="p-12 text-center text-xs text-ink-muted font-medium bg-surface-muted rounded-xl border border-dashed border-border space-y-2">
                <p className="font-bold text-ink">No carrier invoices ingested yet.</p>
                <p>Ingested carrier freight bills will perform 3-way reconciliation against linehaul quote buy rates.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-ink-muted font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Carrier</th>
                      <th className="py-3 px-4">Invoice Date</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Line Items</th>
                      <th className="py-3 px-4">3-Way Match Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium text-ink">
                    {invoices.map((inv) => {
                      const isMatched = inv.matchStatus === "MATCHED";

                      return (
                        <tr key={inv.id} className="hover:bg-surface-muted/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-brand">{inv.invoiceNumber ?? inv.id.slice(0, 10)}</td>
                          <td className="py-3.5 px-4 font-semibold">{inv.carrierId}</td>
                          <td className="py-3.5 px-4 text-ink-muted">
                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : "Today"}
                          </td>
                          <td className="py-3.5 px-4 font-black text-ink">${Number(inv.totalAmount).toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-ink-muted font-bold">{inv.lines.length} Line(s)</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                              isMatched
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : inv.matchStatus === "DISPUTED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {isMatched ? "✓ 3-Way Matched" : inv.matchStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button className="px-3 py-1 rounded-xl bg-surface-muted border border-border text-xs font-bold hover:bg-brand hover:text-white transition-all">
                              Reconcile
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
