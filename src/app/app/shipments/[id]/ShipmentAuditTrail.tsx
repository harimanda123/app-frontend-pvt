"use client";

import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  FileText,
  Filter,
  Edit3,
  ShieldCheck,
  User as UserIcon,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";

export interface ShipmentAuditEntry {
  id: string;
  action: string;
  category: "FIELD_APPROVAL" | "DOCUMENT_INGESTION" | "AGENT_EXECUTION" | "SHIPMENT_MUTATION" | "EXCEPTION_RESOLVED" | "SYSTEM_AUDIT" | "FILING_SUBMISSION";
  title: string;
  description: string;
  source: "UI" | "CHAT" | "SYSTEM" | "API";
  user: {
    name: string | null;
    email?: string | null;
  };
  timestamp: string;
  beforeValue?: string | null;
  afterValue?: string | null;
  metadata?: Record<string, unknown> | null;
}

const SOURCE_BADGES: Record<ShipmentAuditEntry["source"], { label: string; badge: string }> = {
  UI: { label: "User Action", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  CHAT: { label: "Copilot AI", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  SYSTEM: { label: "User Action", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  API: { label: "External API", badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

function getCategoryIcon(category: ShipmentAuditEntry["category"]) {
  switch (category) {
    case "FIELD_APPROVAL":
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
    case "DOCUMENT_INGESTION":
      return <FileText className="w-4 h-4 text-blue-600 shrink-0" />;
    case "SHIPMENT_MUTATION":
      return <Edit3 className="w-4 h-4 text-purple-600 shrink-0" />;
    case "EXCEPTION_RESOLVED":
      return <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />;
    case "FILING_SUBMISSION":
      return <Send className="w-4 h-4 text-brand shrink-0" />;
    default:
      return <Activity className="w-4 h-4 text-indigo-600 shrink-0" />;
  }
}

function formatTimestamp(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ShipmentAuditTrail({ entries }: { entries: ShipmentAuditEntry[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const filteredEntries = entries.filter((e) => {
    if (filter === "ALL") return true;
    if (filter === "FIELD_APPROVAL") return e.category === "FIELD_APPROVAL";
    if (filter === "DOCUMENT_INGESTION") return e.category === "DOCUMENT_INGESTION";
    if (filter === "FILING_SUBMISSION") return e.category === "FILING_SUBMISSION";
    if (filter === "SHIPMENT_MUTATION") return e.category === "SHIPMENT_MUTATION";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-ink-muted font-bold flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-ink-muted" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === "ALL" ? "bg-brand text-white" : "bg-slate-100 text-ink-muted hover:text-ink"
            }`}
          >
            All Human Actions ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("FIELD_APPROVAL")}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === "FIELD_APPROVAL" ? "bg-brand text-white" : "bg-slate-100 text-ink-muted hover:text-ink"
            }`}
          >
            Field Edits & Approvals ({entries.filter((e) => e.category === "FIELD_APPROVAL").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("DOCUMENT_INGESTION")}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === "DOCUMENT_INGESTION" ? "bg-brand text-white" : "bg-slate-100 text-ink-muted hover:text-ink"
            }`}
          >
            Document Uploads ({entries.filter((e) => e.category === "DOCUMENT_INGESTION").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("FILING_SUBMISSION")}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === "FILING_SUBMISSION" ? "bg-brand text-white" : "bg-slate-100 text-ink-muted hover:text-ink"
            }`}
          >
            Filing Submissions ({entries.filter((e) => e.category === "FILING_SUBMISSION").length})
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      {filteredEntries.length === 0 ? (
        <div className="py-12 text-center text-xs text-ink-muted bg-slate-50 rounded-2xl border border-border">
          No human audit events match the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-[11px] font-extrabold text-ink-muted uppercase tracking-wider">
                <th className="py-3 px-4 w-[220px]">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 w-[180px]">User</th>
                <th className="py-3 px-4 w-[190px]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEntries.map((entry) => {
                const isExpanded = expandedEntryId === entry.id;
                const sourceInfo = SOURCE_BADGES[entry.source] || SOURCE_BADGES.UI;

                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Column 1: Action */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(entry.category)}
                        <span className="font-bold text-ink text-xs">{entry.title}</span>
                      </div>
                    </td>

                    {/* Column 2: Details */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1.5">
                        <p className="text-slate-700 leading-snug">{entry.description}</p>

                        {/* Expandable diff / JSON details toggle */}
                        {(entry.beforeValue || entry.afterValue || entry.metadata) && (
                          <div>
                            <button
                              type="button"
                              onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                              className="text-[11px] font-bold text-brand hover:underline inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <span>{isExpanded ? "Hide payload" : "View change details"}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-2 border border-slate-800">
                                {entry.beforeValue && (
                                  <div>
                                    <span className="text-rose-400 font-bold uppercase text-[9px] block font-sans">Previous Value</span>
                                    <span className="text-rose-300">{entry.beforeValue}</span>
                                  </div>
                                )}
                                {entry.afterValue && (
                                  <div>
                                    <span className="text-emerald-400 font-bold uppercase text-[9px] block font-sans">Updated Value</span>
                                    <span className="text-emerald-300">{entry.afterValue}</span>
                                  </div>
                                )}
                                {entry.metadata && (
                                  <div>
                                    <span className="text-slate-400 font-bold uppercase text-[9px] block font-sans mb-1">Metadata</span>
                                    <pre className="text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                      {JSON.stringify(entry.metadata, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 3: User */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center space-x-1.5 font-semibold text-ink text-xs pt-0.5">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]" title={entry.user.name || "User"}>
                          {entry.user.name || "User"}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Timestamp */}
                    <td className="py-3.5 px-4 align-top text-ink-muted font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatTimestamp(entry.timestamp)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
