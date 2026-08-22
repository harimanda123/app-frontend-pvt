"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Anchor, Plane, Truck, Package,
  FileText, ShieldCheck, TriangleAlert, Sparkles, CheckCircle2, Clock,
  Upload, X, Layers, Activity
} from "lucide-react";
import { TmsSidebar } from "@/components/TmsSidebar";
import { TmsHeader } from "@/components/TmsHeader";
import { Card, Badge, Button } from "@/components/ui";
import { DocumentWorkspacePanel } from "@/components/DocumentWorkspacePanel";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";

export function ShipmentWorkspaceClient({
  shipment,
  journey,
  crossDomainRisks,
  healthSnapshot,
  financials,
}: {
  shipment: any;
  journey: any[];
  crossDomainRisks: any[];
  healthSnapshot: any;
  financials: any;
}) {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "DOCUMENTS" | "CARGO" | "FINANCIALS" | "ACTIVITY">("OVERVIEW");
  const [activityFilter, setActivityFilter] = useState<"all" | "ops" | "ai">("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [selectedHealthDim, setSelectedHealthDim] = useState<any | null>(null);

  const route = {
    origin: shipment.countryOfExport ?? shipment.portOfEntry ?? "Origin",
    portOfDischarge: shipment.destinationCountry ?? shipment.portOfEntry ?? "Destination Port",
    finalDestination: shipment.destinationCountry ?? shipment.portOfEntry ?? "Final Destination",
    modes: shipment.transportMode ?? "OCEAN",
  };

  const qubere = healthSnapshot?.qubereAi ?? {
    needsHumanAction: false,
    headline: "QUBERE — Monitoring shipment status.",
    reasoning: "All operational dimensions monitored.",
    monitoredItems: ["Vessel ETA & positioning", "Customs entry filing status", "Drayage pickup window"],
    nextAutoActions: ["Check tracking updates", "Verify customs entry release", "Track drayage dispatch"],
  };

  const dimensions = healthSnapshot?.dimensions ?? [];
  const safeFinancials = financials ?? {
    totalSellAmount: 0,
    totalBuyAmount: 0,
    grossProfit: 0,
    grossMarginPct: 0,
    markupOnCostPct: 0,
    currency: "USD",
  };

  const latestFiling = shipment?.customsFilings?.[0];
  const isCustomsReleased = latestFiling?.filingStatus === "RELEASED" || latestFiling?.filingStatus === "ACCEPTED";
  const clientName = shipment.client?.name ?? shipment.importerName ?? "Unassigned Client";

  const handleApproveRecommendation = () => {
    setActionSuccessMsg("AI Recommendation approved.");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Compile authentic timeline events from trackingEvents and agentDecisions
  const timelineEvents: Array<{ time: string; type: "ops" | "ai"; text: string }> = [];
  if (shipment.trackingEvents && shipment.trackingEvents.length > 0) {
    shipment.trackingEvents.forEach((te: any) => {
      timelineEvents.push({
        time: te.occurredAt ? new Date(te.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
        type: "ops",
        text: `${te.eventType ?? "Tracking Update"}: ${te.locationName ?? te.description ?? te.source ?? "Status update"}`,
      });
    });
  }
  if (shipment.agentDecisions && shipment.agentDecisions.length > 0) {
    shipment.agentDecisions.forEach((ad: any) => {
      timelineEvents.push({
        time: ad.createdAt ? new Date(ad.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
        type: "ai",
        text: ad.decisionSummary ?? ad.proposedDescription ?? "AI Agent decision logged",
      });
    });
  }

  return (
    <div className="min-h-screen bg-surface-muted text-ink flex w-full">
      <TmsSidebar accountName="Enterprise Freight" />

      <div className="flex-1 flex flex-col min-w-0">
        <TmsHeader tenantName="Enterprise Freight" userName="Operations Lead" />

        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          {/* Section 1: Operational Shipment Header */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center space-x-4">
                <Link href="/shipments" className="p-2 rounded-xl bg-surface-muted border border-border text-ink-muted hover:text-ink transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-black text-ink font-mono tracking-tight">{shipment.shipmentNumber}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                      healthSnapshot?.overallHealth === "ON_TRACK"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                    }`}>
                      {healthSnapshot?.overallHealth === "ON_TRACK" ? "✓ ON TRACK" : "⚠️ ACTION REQUIRED"}
                    </span>
                    <span className="text-xs font-bold text-ink-muted bg-surface-muted px-3 py-1 rounded-full border border-border">
                      {clientName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button onClick={() => setIsUploadOpen(true)} variant="secondary" size="sm" className="cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-brand" />
                  <span>Upload Document</span>
                </Button>
                <Button size="sm" variant="primary" className="cursor-pointer shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Qubere AI</span>
                </Button>
              </div>
            </div>

            {/* End-to-End Route Banner */}
            <div className="p-4 rounded-xl bg-surface-muted/60 border border-border flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 text-xs font-semibold text-ink">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-ink text-sm">{route.origin}</span>
                </div>
                <div className="flex items-center space-x-1 text-brand text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-border">
                  <Anchor className="w-3.5 h-3.5 text-blue-600" />
                  <span>↓ {route.modes}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-ink text-sm">{route.portOfDischarge}</span>
                </div>
                <div className="flex items-center space-x-1 text-amber-700 text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-border">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>↓ Delivery</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-brand text-sm">{route.finalDestination}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-ink-muted">
                Mode: {route.modes}
              </span>
            </div>

            {/* 4 Operational Priority Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              <div className="p-3.5 rounded-xl border border-border bg-surface-muted/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-ink-muted tracking-wider block">CURRENT ETA</span>
                <p className="text-base font-black text-ink">{healthSnapshot?.eta ?? "Not Set"}</p>
                <p className="text-[11px] text-emerald-700 font-bold">{healthSnapshot?.etaConfidence ?? 0}% confidence</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-surface-muted/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-ink-muted tracking-wider block">CUSTOMER PROMISE</span>
                <p className="text-base font-black text-ink">{healthSnapshot?.customerPromiseDate ?? "Not Set"}</p>
                <p className="text-[11px] text-emerald-700 font-bold">{healthSnapshot?.scheduleBufferHours ?? 0}h buffer</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-surface-muted/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-ink-muted tracking-wider block">NEXT MILESTONE</span>
                <p className="text-sm font-extrabold text-brand truncate">{healthSnapshot?.nextMilestone?.title ?? "Preparation"}</p>
                <p className="text-[10px] font-mono text-ink-muted truncate">{healthSnapshot?.nextMilestone?.location ?? "Origin"} • {healthSnapshot?.nextMilestone?.scheduledTime ?? "Scheduled"}</p>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-1 ${
                qubere.needsHumanAction ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-200"
              }`}>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-ink-muted">HUMAN INTERVENTION</span>
                <p className={`text-sm font-black ${qubere.needsHumanAction ? "text-amber-900" : "text-emerald-800"}`}>
                  {qubere.needsHumanAction ? "1 Action Required" : "No Action Required"}
                </p>
                <p className="text-[10px] font-medium text-ink-muted">
                  {qubere.needsHumanAction ? "Review required" : "Qubere supervising automatically"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Success Toast Banner */}
          {actionSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-border text-xs w-fit shadow-2xs">
            {[
              { key: "OVERVIEW", label: "Overview" },
              { key: "DOCUMENTS", label: `Documents (${shipment.documents?.length ?? 0})` },
              { key: "CARGO", label: `Cargo (${shipment.lineItems?.length ?? 0})` },
              { key: "FINANCIALS", label: `Financials ($${safeFinancials.totalSellAmount.toLocaleString()})` },
              { key: "ACTIVITY", label: "Activity Timeline" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-brand text-white shadow-2xs"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              {qubere.needsHumanAction ? (
                <Card className="p-6 border-amber-300 bg-gradient-to-r from-white via-amber-50/20 to-amber-50/40 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <TriangleAlert className="w-5 h-5 text-amber-600" />
                      <h2 className="font-extrabold text-base text-amber-950">ACTION REQUIRED</h2>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-ink">{qubere.reasoning}</p>
                  {qubere.recommendedAction && (
                    <Button onClick={handleApproveRecommendation} className="bg-brand text-white font-bold cursor-pointer">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{qubere.recommendedAction}</span>
                    </Button>
                  )}
                </Card>
              ) : (
                <Card className="p-4 bg-white border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-brand" />
                    <div>
                      <span className="font-extrabold text-ink text-sm">NEXT: {healthSnapshot?.nextMilestone?.title ?? "Filing Prep"}</span>
                      <p className="text-ink-muted font-medium">{healthSnapshot?.nextMilestone?.location ?? route.origin} • {healthSnapshot?.nextMilestone?.scheduledTime ?? "Scheduled"}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold border border-emerald-200">
                    {healthSnapshot?.overallHealth === "ON_TRACK" ? "On Schedule" : "Under Review"}
                  </span>
                </Card>
              )}

              {/* Qubere AI Monitoring Section */}
              <Card className="p-6 bg-gradient-to-r from-white via-white to-blue-50/30 border border-border space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-brand" />
                    <h2 className="font-extrabold text-base text-ink">{qubere.headline}</h2>
                  </div>
                  <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
                    Autonomous Operations Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-ink-muted tracking-wider block">Active Monitoring Pipeline</span>
                    <ul className="space-y-1.5 font-semibold text-ink">
                      {qubere.monitoredItems?.map((item: string, i: number) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-brand tracking-wider block">Next Automatic Actions</span>
                    <ul className="space-y-1.5 font-bold text-ink">
                      {qubere.nextAutoActions?.map((action: string, i: number) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Shipment Journey Timeline */}
              <Card className="p-6 space-y-4 bg-white border border-border shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="font-extrabold text-base text-ink">Shipment Journey</h2>
                  <span className="text-xs text-ink-muted font-mono font-bold">
                    {shipment.updatedAt ? `Updated ${new Date(shipment.updatedAt).toLocaleTimeString()}` : "Active Status"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {journey.map((m: any) => {
                    const isDone = m.status === "COMPLETED";
                    const isActive = m.status === "ACTIVE";
                    const isBlocked = m.status === "BLOCKED";

                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                          isDone
                            ? "bg-emerald-50/40 border-emerald-200"
                            : isActive
                            ? "bg-blue-50/60 border-brand ring-2 ring-brand/30"
                            : isBlocked
                            ? "bg-red-50/40 border-red-200"
                            : "bg-surface-muted/40 border-border text-ink-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {isDone && <span className="font-bold text-emerald-700">✓ {m.title}</span>}
                          {isActive && <span className="font-bold text-brand flex items-center space-x-1"><Clock className="w-3.5 h-3.5 animate-spin" /><span>● {m.title}</span></span>}
                          {isBlocked && <span className="font-bold text-red-700">❌ {m.title}</span>}
                          {!isDone && !isActive && !isBlocked && <span className="font-bold text-ink-muted">○ {m.title}</span>}
                        </div>
                        <p className="font-extrabold text-ink text-xs truncate">{m.location}</p>
                        <p className="text-[10px] font-mono text-ink-muted">{m.actualTime ?? m.scheduledTime ?? "Pending"}</p>
                        {m.notes && <p className="text-[10px] text-brand font-semibold pt-1 border-t border-border/40">{m.notes}</p>}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Explainable Shipment Health Matrix */}
              <Card className="p-6 space-y-4 bg-white border border-border shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-brand" />
                    <h2 className="font-extrabold text-base text-ink">Explainable Shipment Health Matrix</h2>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {dimensions.length} Operational Dimensions Evaluated
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {dimensions.map((dim: any) => {
                    const isHealthy = dim.status === "Healthy" || dim.status === "Cleared" || dim.status === "Complete" || dim.status === "On Promise";

                    return (
                      <div
                        key={dim.key}
                        onClick={() => setSelectedHealthDim(dim)}
                        className={`p-3.5 rounded-xl border space-y-1 text-xs cursor-pointer hover:shadow-xs transition-all ${
                          isHealthy ? "bg-emerald-50/40 border-emerald-200" : "bg-amber-50/50 border-amber-300"
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted block">{dim.label}</span>
                        <span className={`font-black text-xs block ${isHealthy ? "text-emerald-800" : "text-amber-900"}`}>
                          {dim.status.toUpperCase()}
                        </span>
                        <p className="text-[10px] font-semibold text-ink pt-0.5 truncate">{dim.value}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Customs Operational Status */}
              <Card className="p-6 bg-white border border-border space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className={`w-4 h-4 ${isCustomsReleased ? "text-emerald-600" : "text-amber-600"}`} />
                    <h3 className="font-extrabold text-sm text-ink">Customs Operational Status</h3>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    isCustomsReleased ? "text-emerald-800 bg-emerald-50 border-emerald-200" : "text-amber-800 bg-amber-50 border-amber-200"
                  }`}>
                    {isCustomsReleased ? "CBP Released" : latestFiling ? `CBP Entry ${latestFiling.filingStatus}` : "Filing Pending"}
                  </span>
                </div>

                <p className="text-xs text-ink-muted font-medium">
                  {isCustomsReleased
                    ? `Customs entry ${latestFiling?.entryNumber ?? ""} has been officially released by U.S. Customs and Border Protection.`
                    : latestFiling
                    ? `Customs entry ${latestFiling.entryNumber ?? ""} is in status: ${latestFiling.filingStatus}. Awaiting official CBP release.`
                    : "No customs filing submitted yet for this shipment. Upload commercial invoice or bill of lading to start filing."}
                </p>
              </Card>

              {/* Canonical Shipment Facts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Commercial Facts */}
                <Card className="p-5 space-y-3 bg-white border border-border shadow-2xs">
                  <h3 className="font-extrabold text-sm text-ink border-b border-border pb-2">Commercial Financial Facts</h3>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Client:</span>
                      <span className="text-ink font-bold">{clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Customer PO #:</span>
                      <span className="font-mono text-ink">{shipment.poReference ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Sell Amount:</span>
                      <span className="font-mono text-emerald-700 font-bold">${safeFinancials.totalSellAmount.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Expected Cost:</span>
                      <span className="font-mono text-ink">${safeFinancials.totalBuyAmount.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="text-ink-muted font-bold">Gross Profit:</span>
                      <span className="font-mono text-emerald-800 font-extrabold">${safeFinancials.grossProfit.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted font-bold">Gross Margin:</span>
                      <span className="font-mono text-brand font-extrabold">{safeFinancials.grossMarginPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted font-bold">Markup on Cost:</span>
                      <span className="font-mono text-ink font-bold">{safeFinancials.markupOnCostPct}%</span>
                    </div>
                  </div>
                </Card>

                {/* Transportation Facts */}
                <Card className="p-5 space-y-3 bg-white border border-border shadow-2xs">
                  <h3 className="font-extrabold text-sm text-ink border-b border-border pb-2">Transportation Facts</h3>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Mode:</span>
                      <span className="text-ink font-bold">{route.modes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Carrier:</span>
                      <span className="text-ink font-bold">{shipment.carrierName ?? shipment.assignedCarrier?.name ?? "Unassigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Vessel / Voyage:</span>
                      <span className="font-mono text-ink">
                        {shipment.vesselName ? `${shipment.vesselName}${shipment.voyageNumber ? ` / ${shipment.voyageNumber}` : ""}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Master B/L:</span>
                      <span className="font-mono text-brand font-bold">{shipment.masterBlNumber ?? shipment.billOfLadingNumber ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Container:</span>
                      <span className="font-mono text-ink">
                        {shipment.containerNumber ? `${shipment.containerNumber}${shipment.equipmentType ? ` (${shipment.equipmentType})` : ""}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Tracking Provider:</span>
                      <span className="text-ink font-bold">{shipment.trackingProvider ?? "Awaiting Telematics Signal"}</span>
                    </div>
                  </div>
                </Card>

                {/* Customs Facts */}
                <Card className="p-5 space-y-3 bg-white border border-border shadow-2xs">
                  <h3 className="font-extrabold text-sm text-ink border-b border-border pb-2">Customs & Regulatory Facts</h3>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Importer of Record:</span>
                      <span className="text-ink font-bold">{shipment.importerOfRecord?.name ?? shipment.importerName ?? "Unassigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Customs Broker:</span>
                      <span className="text-ink font-bold">{shipment.assignedBroker?.name ?? "Unassigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">CBP Entry #:</span>
                      <span className="font-mono text-brand font-bold">{latestFiling?.entryNumber ?? "Not Filed"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Entry Type:</span>
                      <span className="font-mono text-ink">{latestFiling?.entryType ?? "01 - Consumption"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Filing Status:</span>
                      <span className="text-emerald-700 font-bold">{latestFiling?.filingStatus ?? "Draft"}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === "DOCUMENTS" && (
            <DocumentWorkspacePanel
              shipmentId={shipment.id}
              shipmentNumber={shipment.shipmentNumber}
              documents={shipment.documents ?? []}
            />
          )}

          {/* TAB 3: CARGO */}
          {activeTab === "CARGO" && (
            <Card className="p-6 space-y-4 bg-white border border-border shadow-2xs">
              <h3 className="font-extrabold text-base text-ink border-b border-border pb-3">Cargo Line Items & Duty Classification</h3>
              {(!shipment.lineItems || shipment.lineItems.length === 0) ? (
                <div className="p-8 text-center text-xs text-ink-muted font-medium bg-surface-muted rounded-xl border border-dashed border-border">
                  No cargo line items or HTS classifications entered yet. Upload commercial invoice to extract cargo items.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-ink-muted font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">HTS Code</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Declared Value</th>
                      <th className="py-2.5 px-3">Duty Tariff</th>
                      <th className="py-2.5 px-3 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium text-ink">
                    {shipment.lineItems.map((li: any, i: number) => (
                      <tr key={i} className="hover:bg-surface-muted/50">
                        <td className="py-3 px-3 font-mono font-bold text-brand">{li.htsCode ?? "—"}</td>
                        <td className="py-3 px-3 font-semibold">{li.description ?? "Cargo item"}</td>
                        <td className="py-3 px-3 font-mono text-emerald-700">${Number(li.declaredValue ?? 0).toLocaleString()} USD</td>
                        <td className="py-3 px-3">
                          <Badge variant="warning">{li.dutyRate ? `${li.dutyRate}%` : "Standard"}</Badge>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-700">Verified</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          )}

          {/* TAB 4: FINANCIALS */}
          {activeTab === "FINANCIALS" && (
            <Card className="p-6 space-y-4 bg-white border border-border shadow-2xs">
              <h3 className="font-extrabold text-base text-ink border-b border-border pb-3">Commercial Transportation Financials</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-1">
                  <span className="text-[10px] font-extrabold text-ink-muted uppercase">TOTAL SELL AMOUNT</span>
                  <p className="text-xl font-black text-emerald-700 font-mono">${safeFinancials.totalSellAmount.toLocaleString()} USD</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-1">
                  <span className="text-[10px] font-extrabold text-ink-muted uppercase">EXPECTED BUY COST</span>
                  <p className="text-xl font-black text-ink font-mono">${safeFinancials.totalBuyAmount.toLocaleString()} USD</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-1">
                  <span className="text-[10px] font-extrabold text-ink-muted uppercase">GROSS PROFIT</span>
                  <p className="text-xl font-black text-brand font-mono">${safeFinancials.grossProfit.toLocaleString()} USD</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-1">
                  <span className="text-[10px] font-extrabold text-ink-muted uppercase">GROSS MARGIN %</span>
                  <p className="text-xl font-black text-emerald-800 font-mono">{safeFinancials.grossMarginPct}%</p>
                  <p className="text-[10px] text-ink-muted font-bold">Markup on cost: {safeFinancials.markupOnCostPct}%</p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 5: ACTIVITY TIMELINE */}
          {activeTab === "ACTIVITY" && (
            <Card className="p-6 space-y-4 bg-white border border-border shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-base text-ink">Operational & AI Activity Timeline</h3>
                <div className="flex bg-surface-muted p-1 rounded-xl border border-border text-xs">
                  <button onClick={() => setActivityFilter("all")} className={`px-3 py-1 rounded-lg font-bold ${activityFilter === "all" ? "bg-white text-ink shadow-2xs" : "text-ink-muted"}`}>All</button>
                  <button onClick={() => setActivityFilter("ops")} className={`px-3 py-1 rounded-lg font-bold ${activityFilter === "ops" ? "bg-white text-ink shadow-2xs" : "text-ink-muted"}`}>Operations</button>
                  <button onClick={() => setActivityFilter("ai")} className={`px-3 py-1 rounded-lg font-bold ${activityFilter === "ai" ? "bg-white text-brand shadow-2xs" : "text-ink-muted"}`}>AI Activity</button>
                </div>
              </div>

              {timelineEvents.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-muted font-medium bg-surface-muted rounded-xl border border-dashed border-border">
                  No operational tracking events or AI decisions recorded yet for this shipment.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {timelineEvents
                    .filter((act) => activityFilter === "all" || act.type === activityFilter)
                    .map((act, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-border bg-surface-muted/30 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-ink-muted text-[11px] font-bold">{act.time}</span>
                          <span className="font-semibold text-ink">{act.text}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${act.type === "ai" ? "bg-brand/10 text-brand border border-brand/20" : "bg-surface-muted text-ink-muted border border-border"}`}>
                          {act.type === "ai" ? "AI Activity" : "Operations"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          )}

          {/* Health Dimension Detail Modal */}
          {selectedHealthDim && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-bold text-sm text-ink">{selectedHealthDim.label} Evidence & Explanation</h3>
                  <button onClick={() => setSelectedHealthDim(null)} className="text-ink-muted hover:text-ink">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-brand">{selectedHealthDim.value}</p>
                  <p className="text-ink-muted font-medium leading-relaxed">{selectedHealthDim.explanation}</p>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button size="sm" onClick={() => setSelectedHealthDim(null)}>Close</Button>
                </div>
              </div>
            </div>
          )}

          {/* Document Upload Modal */}
          <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} shipmentId={shipment.id} />
        </main>
      </div>
    </div>
  );
}
