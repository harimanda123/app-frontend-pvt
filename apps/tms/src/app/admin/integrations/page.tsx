import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TmsSidebar } from "@/components/TmsSidebar";
import { TmsHeader } from "@/components/TmsHeader";
import { Plug, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

export default async function AdminIntegrationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const integrations = [
    { id: "int_01", name: "Project44 Visibility Platform", category: "GPS & Telemetry", status: "Connected", detail: "Real-time truck location and ETA forecasting", lastSync: "2 mins ago" },
    { id: "int_02", name: "Samsara Fleet ELD", category: "Fleet & Driver HOS", status: "Connected", detail: "Driver logs, vehicle health, and geofencing", lastSync: "5 mins ago" },
    { id: "int_03", name: "FourKites Tracking", category: "Supply Chain Visibility", status: "Available", detail: "Multi-modal ocean and rail tracking integration", lastSync: "Not connected" },
    { id: "int_04", name: "QuickBooks Online / Enterprise", category: "Accounting & Freight Invoices", status: "Connected", detail: "Automated general ledger syncing for 3-way invoice matching", lastSync: "1 hour ago" },
    { id: "int_05", name: "NetSuite ERP Provider", category: "Enterprise ERP", status: "Available", detail: "Sync sales orders, customers, and inventory holds", lastSync: "Not connected" },
  ];

  return (
    <div className="min-h-screen bg-surface-muted text-ink flex w-full">
      <TmsSidebar accountName="Enterprise Freight" />

      <div className="flex-1 flex flex-col min-w-0">
        <TmsHeader tenantName="Enterprise Freight" userName="Operations Lead" />

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <Plug className="w-4 h-4 text-brand" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">Connected ERP & Carrier Integrations</h1>
              </div>
              <p className="text-xs text-ink-muted mt-1">
                Manage telematics APIs, ERP connectors, accounting sync, and API webhooks.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a href="/admin/integrations/api-docs" className="px-3.5 py-2 bg-white border border-border rounded-xl text-xs font-bold text-ink hover:bg-surface-muted flex items-center space-x-2">
                <span>View Full API Catalog</span>
              </a>
              <Button className="flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>Generate API Secret Key</span>
              </Button>
            </div>
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((item) => (
              <Card key={item.id} className="p-6 bg-white border border-border space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-ink">{item.name}</h3>
                    <p className="text-[11px] font-semibold text-brand">{item.category}</p>
                  </div>
                  {item.status === "Connected" ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-muted text-ink-muted border border-border text-[10px] font-bold">
                      Available
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted">{item.detail}</p>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[10px] text-ink-muted font-mono">Last sync: {item.lastSync}</span>
                  <button className="font-semibold text-brand hover:underline flex items-center space-x-1">
                    <span>{item.status === "Connected" ? "Configure" : "Connect"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
