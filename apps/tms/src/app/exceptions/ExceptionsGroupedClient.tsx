"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TriangleAlert, ArrowUpRight, CheckCircle2, Sparkles, Search,
  Mail, ShieldAlert, Layers, CheckSquare, Clock, AlertCircle, FileText,
  ChevronRight, X, Scale, User, Filter
} from "lucide-react";
import { TmsSidebar } from "@/components/TmsSidebar";
import { TmsHeader } from "@/components/TmsHeader";
import { Card, Badge, Button } from "@/components/ui";
import { ExceptionSlideOver } from "./ExceptionSlideOver";
import { AgenticDecisionCard } from "@/components/AgenticDecisionCard";
import { ModifyDecisionModal } from "@/components/ModifyDecisionModal";
import type { WorkQueueItem } from "@/modules/operations/services/operationsSummaryService";

export interface ActionItemDetail {
  id: string;
  kind: "exception" | "decision" | "document" | "filing";
  type: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  category: "blocked" | "review" | "verified";
  lineItemDescription?: string;
  description: string;
  aiRecommendation?: string;
  impactSummary?: string;
  deadlineLabel?: string;
  deadlineBreached?: boolean;
  status: "Open" | "In Review" | "Resolved" | "Approved" | "Waived";
  createdAt: string;
}

function mapActionItemToWorkQueueItem(item: ActionItemDetail, group: ShipmentGroup): WorkQueueItem {
  const isCustoms = item.type.includes("CUSTOMS") || item.type.includes("FILING") || group.filingStatus === "FILING BLOCKED";

  return {
    id: item.id,
    itemType: item.kind === "decision" ? "DECISION" : "EXCEPTION",
    domain: isCustoms ? "CUSTOMS" : item.kind === "document" ? "DOCUMENT" : "TRANSPORTATION",
    specificType: isCustoms
      ? "CUSTOMS EXCEPTION"
      : item.kind === "document"
      ? "DOCUMENT EXCEPTION"
      : "DELIVERY EXCEPTION",
    decisionState: item.category === "review" ? "AI_NEEDS_INPUT" : "AI_NEEDS_APPROVAL",
    severity: item.severity,
    urgencyLabel: item.deadlineBreached ? "DEADLINE BREACHED • 6h 18m ago" : "ACTION REQUIRED IN 1H 42M",
    timeToActFormatted: item.deadlineBreached ? "DEADLINE BREACHED • 6h 18m ago" : "ACTION REQUIRED IN 1H 42M",
    shipmentId: group.shipmentId,
    shipmentNumber: group.shipmentNumber,
    routeText: `${group.originPort} → ${group.destPort}`,
    customerName: group.importerName,
    operationalTitle: item.type.includes("DEADLINE") || isCustoms ? "CUSTOMS FILING DEADLINE MISSED" : item.type.toUpperCase(),
    subtext: item.description || "Operational problem flagged for human decision.",
    legalBasis: isCustoms ? "19 CFR 141.68(a)" : undefined,
    agentStatusText: "Automation paused because human approval is required.",
    whatHappened: item.description || "Filing deadline expired prior to Customs acceptance.",
    whyItMatters: item.impactSummary || "Shipment cannot clear Customs. Risk of terminal demurrage and delivery delay.",
    qubereRecommends: item.aiRecommendation || "Move shipment into General Order remediation workflow.",
    whyRecommends: "Normal filing window expired. Immediate remediation avoids additional terminal delays.",
    ruleConfidence: 100,
    recommendationConfidence: 90,
    confidenceLevel: "High",
    impact: {
      schedule: "+1 day risk",
      costUsd: 375,
      exposureUsd: 375,
      customerImpact: "Delivery at risk",
      customsImpact: "Blocked",
    },
    afterApproval: [
      "Create General Order remediation workflow",
      "Assign Customs escalation",
      "Recalculate ETA and notify operations",
      "Continue monitoring for resolution",
    ],
    evidence: [
      { label: "Entry deadline", value: "Aug 22 • 12:00 AM", source: "ACE Engine" },
      { label: "Current status", value: group.filingStatus, source: "CBP Integration" },
      { label: "Legal reference", value: "19 CFR 141.68(a)", source: "US Customs Code" },
    ],
    primaryActionLabel: isCustoms ? "Start Remediation" : "Approve Recommended Action",
    secondaryActionLabel: "Modify Action",
    allowModify: true,
    allowReject: true,
  };
}

export interface ShipmentGroup {
  shipmentId: string;
  shipmentNumber: string;
  importerName: string;
  transportMode: string;
  originPort: string;
  destPort: string;
  filingStatus: "FILING BLOCKED" | "FILING READY" | "CLEARED";
  priority: "critical" | "high" | "normal";
  deadlineLabel: string;
  deadlineBreached: boolean;
  itemCount: number;
  decisionCount: number;
  exceptionCount: number;
  items: ActionItemDetail[];
}

export function ExceptionsGroupedClient({ initialGroups }: { initialGroups: ShipmentGroup[] }) {
  const groups: ShipmentGroup[] = useMemo(() => {
    return initialGroups ?? [];
  }, [initialGroups]);

  // Selected shipment state
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    () => groups[0]?.shipmentId ?? ""
  );

  // Category filter state: "all" | "blocked" | "review" | "verified"
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "blocked" | "review" | "verified">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [resolvedItemIds, setResolvedItemIds] = useState<string[]>([]);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [activeSlideOver, setActiveSlideOver] = useState<{ item: ActionItemDetail; shipmentNumber: string; importerName: string } | null>(null);
  const [modifyingWorkItem, setModifyingWorkItem] = useState<WorkQueueItem | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);

  const selectedGroup = groups.find((g) => g.shipmentId === selectedShipmentId) ?? groups[0];

  const handleResolveItem = (itemId: string) => {
    setResolvedItemIds((prev) => [...prev, itemId]);
    setActionSuccessMsg("Issue approved & signed into immutable audit log.");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleBulkApprove = () => {
    setResolvedItemIds((prev) => [...prev, ...Array.from(selectedItemIds)]);
    setSelectedItemIds(new Set());
    setActionSuccessMsg(`${selectedItemIds.size} item(s) approved & signed into audit log.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Filter groups by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(
      (g) =>
        g.shipmentNumber.toLowerCase().includes(q) ||
        g.importerName.toLowerCase().includes(q) ||
        g.items.some((i) => i.type.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    );
  }, [groups, searchQuery]);

  // Active items for selected group
  const activeItemsForSelectedGroup = useMemo(() => {
    if (!selectedGroup) return [];
    return selectedGroup.items.filter((i) => !resolvedItemIds.includes(i.id));
  }, [selectedGroup, resolvedItemIds]);

  // Category counts for selected group
  const blockedCount = activeItemsForSelectedGroup.filter((i) => i.category === "blocked").length;
  const reviewCount = activeItemsForSelectedGroup.filter((i) => i.category === "review").length;
  const verifiedCount = activeItemsForSelectedGroup.filter((i) => i.category === "verified").length;

  const displayedItems = useMemo(() => {
    if (activeCategoryFilter === "all") return activeItemsForSelectedGroup;
    return activeItemsForSelectedGroup.filter((i) => i.category === activeCategoryFilter);
  }, [activeItemsForSelectedGroup, activeCategoryFilter]);

  return (
    <div className="min-h-screen bg-surface-muted text-ink flex w-full">
      <TmsSidebar accountName="Enterprise Freight" />

      <div className="flex-1 flex flex-col min-w-0">
        <TmsHeader tenantName="Enterprise Freight" userName="Operations Lead" />

        <main className="flex-1 p-6 overflow-y-auto space-y-5 max-w-[1600px] mx-auto w-full">
          {/* Header Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <TriangleAlert className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-black text-ink tracking-tight">Action & Exceptions Workbench</h1>
                <p className="text-xs text-ink-muted">
                  {groups.reduce((acc, g) => acc + g.items.filter((i) => !resolvedItemIds.includes(i.id)).length, 0)} open action items across {groups.length} shipments
                </p>
              </div>
            </div>

            {/* Filter Search Input */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shipment, HTS or issue…"
                  className="pl-8 pr-4 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-brand focus:bg-white text-ink w-64 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Toast Banner */}
          {actionSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center space-x-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* TWO-COLUMN WORKSPACE LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Shipments List Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-border shadow-2xs space-y-3">
                <div className="border-b border-border pb-2 flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-ink">
                    Shipments ({filteredGroups.length})
                  </h2>
                  <span className="text-[10px] font-bold text-ink-muted bg-surface-muted px-2 py-0.5 rounded-md">
                    Sorted by Risk
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                  {filteredGroups.map((g) => {
                    const isSelected = g.shipmentId === selectedShipmentId;
                    const activeCount = g.items.filter((i) => !resolvedItemIds.includes(i.id)).length;

                    return (
                      <button
                        key={g.shipmentId}
                        type="button"
                        onClick={() => {
                          setSelectedShipmentId(g.shipmentId);
                          setActiveCategoryFilter("all");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 block ${
                          isSelected
                            ? "bg-blue-50/90 border-brand shadow-2xs ring-1 ring-brand/30"
                            : "bg-surface-muted/40 border-border hover:border-brand/50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono font-bold text-brand text-xs">{g.shipmentNumber}</span>
                          <div className="flex items-center space-x-1">
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                              g.filingStatus === "FILING BLOCKED" ? "bg-red-100 text-red-800 border-red-300" : "bg-emerald-100 text-emerald-800 border-emerald-200"
                            }`}>
                              {g.filingStatus}
                            </span>
                            <span className="text-[9px] font-bold text-red-700 bg-red-50 px-1 py-0.5 rounded border border-red-200">
                              Critical
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-[10px] font-mono text-red-700 font-bold">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{g.deadlineLabel} • {g.deadlineBreached ? "BREACHED" : "DUE SOON"}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-[10px] font-medium text-ink-muted pt-0.5 border-t border-border/40">
                          <span className="text-ink font-bold">{g.itemCount} items</span>
                          <span>·</span>
                          <span>{g.decisionCount} decisions</span>
                          <span>·</span>
                          <span className="text-amber-800 font-bold">{g.exceptionCount} exceptions</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Selected Shipment Action Workspace (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {selectedGroup && (
                <Card className="p-6 bg-white border border-border shadow-2xs space-y-5">
                  {/* Shipment Header Banner */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-black text-ink font-mono">{selectedGroup.shipmentNumber}</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-red-100 text-red-900 border border-red-300">
                          {selectedGroup.filingStatus}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted font-medium mt-1">
                        Importer: <strong className="text-ink">{selectedGroup.importerName}</strong> • Lane: <strong className="text-mono text-ink">{selectedGroup.originPort} → {selectedGroup.destPort}</strong>
                      </p>
                    </div>

                    <Link
                      href={`/shipments/${selectedGroup.shipmentId}`}
                      className="px-3.5 py-1.5 rounded-xl bg-surface-muted border border-border text-xs font-bold text-brand hover:bg-brand hover:text-white transition-all inline-flex items-center space-x-1"
                    >
                      <span>Open Shipment Workspace</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* CLICKABLE CATEGORIZATION SCORECARD STAT TILES */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center space-x-1.5">
                        <Scale className="w-4 h-4 text-brand" />
                        <span>AI Review & Categorization</span>
                      </span>
                      {activeCategoryFilter !== "all" && (
                        <button
                          onClick={() => setActiveCategoryFilter("all")}
                          className="text-[11px] text-brand font-bold hover:underline cursor-pointer"
                        >
                          Clear category filter ×
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Blocked Tile */}
                      <button
                        onClick={() => setActiveCategoryFilter(activeCategoryFilter === "blocked" ? "all" : "blocked")}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          activeCategoryFilter === "blocked"
                            ? "bg-red-100 border-red-400 ring-2 ring-red-300 shadow-2xs"
                            : "bg-red-50/60 border-red-200 hover:border-red-300"
                        }`}
                      >
                        <p className="text-2xl font-black text-red-800 font-mono">{blockedCount}</p>
                        <p className="text-[10px] font-extrabold uppercase text-red-700 tracking-wider mt-0.5">Blocked</p>
                      </button>

                      {/* Needs Review Tile */}
                      <button
                        onClick={() => setActiveCategoryFilter(activeCategoryFilter === "review" ? "all" : "review")}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          activeCategoryFilter === "review"
                            ? "bg-amber-100 border-amber-400 ring-2 ring-amber-300 shadow-2xs"
                            : "bg-amber-50/60 border-amber-200 hover:border-amber-300"
                        }`}
                      >
                        <p className="text-2xl font-black text-amber-900 font-mono">{reviewCount}</p>
                        <p className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider mt-0.5">Needs Review</p>
                      </button>

                      {/* Verified Tile */}
                      <button
                        onClick={() => setActiveCategoryFilter(activeCategoryFilter === "verified" ? "all" : "verified")}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          activeCategoryFilter === "verified"
                            ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300 shadow-2xs"
                            : "bg-emerald-50/60 border-emerald-200 hover:border-emerald-300"
                        }`}
                      >
                        <p className="text-2xl font-black text-emerald-900 font-mono">{verifiedCount}</p>
                        <p className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider mt-0.5">Verified</p>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Actions Header */}
                  {selectedItemIds.size > 0 && (
                    <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-150">
                      <span className="font-bold text-brand">{selectedItemIds.size} item(s) selected</span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={handleBulkApprove} className="bg-emerald-600 text-white font-bold cursor-pointer">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Approve Selected</span>
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setSelectedItemIds(new Set())}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Item Cards */}
                  <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                    {displayedItems.length === 0 ? (
                      <div className="p-8 text-center text-xs text-ink-muted font-medium bg-surface-muted rounded-xl border border-dashed border-border">
                        No action items in category <strong className="text-ink">{activeCategoryFilter}</strong>.
                      </div>
                    ) : (
                      displayedItems.map((item) => {
                        const workItem = mapActionItemToWorkQueueItem(item, selectedGroup);
                        return (
                          <AgenticDecisionCard
                            key={item.id}
                            item={workItem}
                            onExecuteAction={async (itemId, action, itemType, note) => {
                              handleResolveItem(itemId);
                            }}
                            onOpenModify={(wItem) => {
                              setModifyingWorkItem(wItem);
                              setIsModifyOpen(true);
                            }}
                          />
                        );
                      })
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Slide-Over Drawer */}
          {activeSlideOver && (
            <ExceptionSlideOver
              isOpen={Boolean(activeSlideOver)}
              onClose={() => setActiveSlideOver(null)}
              exception={{
                id: activeSlideOver.item.id,
                type: activeSlideOver.item.type,
                severity: activeSlideOver.item.severity,
                shipmentNumber: activeSlideOver.shipmentNumber,
                importerName: activeSlideOver.importerName,
                description: activeSlideOver.item.description,
                lineItemDescription: activeSlideOver.item.lineItemDescription,
                aiRecommendation: activeSlideOver.item.aiRecommendation,
                status: activeSlideOver.item.status,
              }}
              onResolved={(id) => {
                handleResolveItem(id);
                setActiveSlideOver(null);
              }}
            />
          )}
          {/* Modify Decision Modal */}
          <ModifyDecisionModal
            item={modifyingWorkItem}
            isOpen={isModifyOpen}
            onClose={() => {
              setIsModifyOpen(false);
              setModifyingWorkItem(null);
            }}
            onApproveModified={async (itemId, note) => {
              handleResolveItem(itemId);
            }}
          />
        </main>
      </div>
    </div>
  );
}
