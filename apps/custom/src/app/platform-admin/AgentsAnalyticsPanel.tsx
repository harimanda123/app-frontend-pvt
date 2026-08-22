"use client";

import { useState } from "react";
import {
  Bot,
  Zap,
  Users,
  Layers,
  TrendingUp,
  Wrench,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileText,
  Clock,
  FileCheck2,
  ScanText,
  Boxes,
  Scale,
  Globe2,
  Calculator,
  ShieldAlert,
  Send,
  Receipt,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type {
  AiUsageAnalytics,
  AiSurfaceUsage,
  AiDailyUsage,
  AiAccountUsage,
} from "@/lib/ai/aiUsageAnalytics";
import type { DocumentProcessingAnalytics } from "@/lib/documents/documentProcessingAnalytics";

function formatShortDate(dateKey: string | undefined): string {
  if (!dateKey) return "";
  return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatCompactNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

const STATUS_BADGE: Record<string, { variant: "success" | "warning" | "danger" | "info" | "neutral"; icon: typeof CheckCircle2 }> = {
  ANSWERED: { variant: "success", icon: CheckCircle2 },
  PARTIAL: { variant: "warning", icon: AlertTriangle },
  ERROR: { variant: "danger", icon: XCircle },
  NEEDS_CLARIFICATION: { variant: "info", icon: HelpCircle },
  NOT_FOUND: { variant: "neutral", icon: HelpCircle },
  NOT_AUTHORIZED: { variant: "neutral", icon: HelpCircle },
  INSUFFICIENT_DATA: { variant: "neutral", icon: HelpCircle },
};

function StatTile({
  icon: Icon,
  label,
  value,
  footnote,
}: {
  icon: typeof Bot;
  label: string;
  value: string;
  footnote: string;
}) {
  return (
    <div className="apple-card p-5 rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex items-center space-x-2 text-ink-muted text-xs font-bold uppercase tracking-wider mb-2">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-ink tabular-nums">{value}</p>
      <p className="text-[10px] text-ink-muted mt-1">{footnote}</p>
    </div>
  );
}

function UsageTrendChart({ daily }: { daily: AiDailyUsage[] }) {
  const [metric, setMetric] = useState<"requests" | "totalTokens">("requests");
  const max = Math.max(1, ...daily.map((d) => d[metric]));

  return (
    <div className="apple-card p-6 rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>Usage Trend</span>
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Daily {metric === "requests" ? "LLM calls" : "tokens spent"} across every surface and account.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-muted rounded-full p-1 border border-border self-start sm:self-auto">
          <button
            onClick={() => setMetric("requests")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              metric === "requests" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Calls
          </button>
          <button
            onClick={() => setMetric("totalTokens")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              metric === "totalTokens" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Tokens
          </button>
        </div>
      </div>

      {daily.length === 0 || max <= 1 ? (
        <div className="h-40 flex items-center justify-center text-sm text-ink-muted">
          No recorded AI usage in this window yet.
        </div>
      ) : (
        <>
          <div className="h-40 flex items-end gap-[3px]">
            {daily.map((d) => {
              const value = d[metric];
              const heightPct = value > 0 ? Math.max(3, (value / max) * 100) : 0;
              return (
                <div
                  key={d.date}
                  className="flex-1 h-full flex flex-col justify-end group relative"
                  title={`${formatShortDate(d.date)}: ${value.toLocaleString()} ${
                    metric === "requests" ? "calls" : "tokens"
                  }`}
                >
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-brand/60 to-brand transition-colors group-hover:from-amber-500 group-hover:to-amber-400"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-ink-muted mt-2 font-mono">
            <span>{formatShortDate(daily[0]?.date)}</span>
            <span>{formatShortDate(daily[daily.length - 1]?.date)}</span>
          </div>
        </>
      )}
    </div>
  );
}

function SurfaceUsageTable({ bySurface, totalTokens }: { bySurface: AiSurfaceUsage[]; totalTokens: number }) {
  return (
    <div className="apple-card rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-ink flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-600" />
          <span>Usage by Surface</span>
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">Every AI capability metered on this platform, whether or not it has run yet.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink">
          <thead className="bg-surface-muted border-b border-border text-xs uppercase font-bold text-ink-muted">
            <tr>
              <th className="px-6 py-4">Surface</th>
              <th className="px-6 py-4">Model</th>
              <th className="px-6 py-4">Calls</th>
              <th className="px-6 py-4">Input Tokens</th>
              <th className="px-6 py-4">Output Tokens</th>
              <th className="px-6 py-4">Share of Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bySurface.map((s) => {
              const share = totalTokens > 0 ? s.totalTokens / totalTokens : 0;
              return (
                <tr key={s.surface} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-ink">{s.label}</div>
                    <div className="text-[10px] font-mono text-ink-muted">{s.surface}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info" className="font-mono normal-case text-[10px]">
                      {s.model}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono tabular-nums">{s.requests.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono tabular-nums text-ink-muted">{s.inputTokens.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono tabular-nums text-ink-muted">{s.outputTokens.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${Math.max(share > 0 ? 2 : 0, share * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-ink-muted w-9 text-right">
                        {(share * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopAccountsTable({ accounts }: { accounts: AiAccountUsage[] }) {
  return (
    <div className="apple-card rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-ink flex items-center space-x-2">
          <Users className="w-5 h-5 text-amber-600" />
          <span>Top Accounts by AI Usage</span>
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">Highest token spend across all surfaces in the selected window.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink">
          <thead className="bg-surface-muted border-b border-border text-xs uppercase font-bold text-ink-muted">
            <tr>
              <th className="px-6 py-4">Account</th>
              <th className="px-6 py-4">Calls</th>
              <th className="px-6 py-4">Total Tokens</th>
              <th className="px-6 py-4">Top Surface</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {accounts.map((a) => (
              <tr key={a.accountId} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-ink">{a.accountName}</div>
                  <div className="text-[10px] font-mono text-ink-muted">{a.accountId}</div>
                </td>
                <td className="px-6 py-4 font-mono tabular-nums">{a.requests.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono tabular-nums">{a.totalTokens.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {a.topSurface ? (
                    <Badge variant="neutral" className="normal-case text-[10px]">
                      {a.topSurface}
                    </Badge>
                  ) : (
                    <span className="text-ink-muted text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink-muted">
                  No account has used a metered AI surface in this window yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CopilotHealthSection({ data }: { data: AiUsageAnalytics["copilot"] }) {
  const answered = data.statusCounts.ANSWERED ?? 0;
  const answerRate = data.totalQueries > 0 ? answered / data.totalQueries : 0;

  return (
    <div className="apple-card rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-ink flex items-center space-x-2">
          <Bot className="w-5 h-5 text-amber-600" />
          <span>Chat Assistant Query Health</span>
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          From the audit trail (`/chat`), sampled up to the {data.sampleSize.toLocaleString()} most recent entries
          {data.sampled ? " — the window is larger than the sample, so figures below are a recent slice, not a full total." : " in this window."}
        </p>
      </div>

      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-border">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Questions Asked</p>
          <p className="text-xl font-extrabold text-ink tabular-nums">{data.totalQueries.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Answer Rate</p>
          <p className="text-xl font-extrabold text-ink tabular-nums">{(answerRate * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Avg Turn Duration</p>
          <p className="text-xl font-extrabold text-ink tabular-nums">{(data.avgDurationMs / 1000).toFixed(1)}s</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Avg Tool Calls / Turn</p>
          <p className="text-xl font-extrabold text-ink tabular-nums">{data.avgToolCallsPerQuery.toFixed(1)}</p>
        </div>
      </div>

      <div className="p-6 border-b border-border flex flex-wrap gap-2">
        {Object.entries(data.statusCounts).length === 0 ? (
          <span className="text-sm text-ink-muted">No chat assistant activity recorded in this window.</span>
        ) : (
          Object.entries(data.statusCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([status, count]) => {
              const meta = STATUS_BADGE[status] ?? { variant: "neutral" as const, icon: HelpCircle };
              const Icon = meta.icon;
              return (
                <Badge key={status} variant={meta.variant} className="normal-case text-xs gap-1.5 py-1 px-3">
                  <Icon className="w-3 h-3" />
                  <span>
                    {status} · {count.toLocaleString()}
                  </span>
                </Badge>
              );
            })
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink">
          <thead className="bg-surface-muted border-b border-border text-xs uppercase font-bold text-ink-muted">
            <tr>
              <th className="px-6 py-4">Tool</th>
              <th className="px-6 py-4">Calls</th>
              <th className="px-6 py-4">Success Rate</th>
              <th className="px-6 py-4">Avg Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.toolStats.map((t) => (
              <tr key={t.tool} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-ink-muted" />
                  {t.tool}
                </td>
                <td className="px-6 py-4 font-mono tabular-nums">{t.calls.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={t.successRate >= 0.95 ? "success" : t.successRate >= 0.8 ? "warning" : "danger"} className="normal-case text-xs">
                    {(t.successRate * 100).toFixed(0)}%
                  </Badge>
                </td>
                <td className="px-6 py-4 font-mono tabular-nums text-ink-muted">{t.avgDurationMs.toLocaleString()}ms</td>
              </tr>
            ))}
            {data.toolStats.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink-muted">
                  No tool calls recorded in this window.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentProcessingSection({ data }: { data: DocumentProcessingAnalytics }) {
  const { statusCounts, confidence, latency, errors } = data;

  return (
    <div className="apple-card rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-ink flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>Document Processing</span>
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Parse and extraction runs (<code>DocumentParseVersion</code>) over the last {data.rangeDays} days.
        </p>
      </div>

      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-border">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Succeeded</p>
          <p className="text-xl font-extrabold text-emerald-600 tabular-nums">{statusCounts.succeeded.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Failed</p>
          <p className="text-xl font-extrabold text-red-600 tabular-nums">{statusCounts.failed.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Needs Review</p>
          <p className="text-xl font-extrabold text-amber-600 tabular-nums">{statusCounts.needsReview.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">Processing</p>
          <p className="text-xl font-extrabold text-ink tabular-nums">{statusCounts.processing.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" />
            Parse Confidence
          </h3>
          {confidence.sampleSize === 0 ? (
            <p className="text-sm text-ink-muted">No run in this window reported a confidence score.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-ink-muted">Median</p>
                <p className="text-lg font-extrabold text-ink tabular-nums">{confidence.median?.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-ink-muted">P90</p>
                <p className="text-lg font-extrabold text-ink tabular-nums">{confidence.p90?.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-ink-muted">P99</p>
                <p className="text-lg font-extrabold text-ink tabular-nums">{confidence.p99?.toFixed(0)}%</p>
              </div>
            </div>
          )}
          <p className="text-[10px] text-ink-muted mt-2">
            Median/P90/P99 are shown instead of an average — confidence is skewed, and an average hides a low-confidence tail. Based on {confidence.sampleSize.toLocaleString()} run{confidence.sampleSize === 1 ? "" : "s"} with a reported score.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Processing Latency
          </h3>
          {latency.sampleSize === 0 ? (
            <p className="text-sm text-ink-muted">No completed run in this window recorded a duration.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-ink-muted">Median</p>
                <p className="text-lg font-extrabold text-ink tabular-nums">{((latency.medianMs ?? 0) / 1000).toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-[10px] text-ink-muted">P90</p>
                <p className="text-lg font-extrabold text-ink tabular-nums">{((latency.p90Ms ?? 0) / 1000).toFixed(1)}s</p>
              </div>
            </div>
          )}
          <p className="text-[10px] text-ink-muted mt-2">Based on {latency.sampleSize.toLocaleString()} completed run{latency.sampleSize === 1 ? "" : "s"}.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink">
          <thead className="bg-surface-muted border-b border-border text-xs uppercase font-bold text-ink-muted">
            <tr>
              <th className="px-6 py-4">Error Code</th>
              <th className="px-6 py-4">Failures</th>
              <th className="px-6 py-4">Still Retryable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {errors.map((e) => (
              <tr key={e.errorCode} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold">{e.errorCode}</td>
                <td className="px-6 py-4 font-mono tabular-nums">{e.count.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={e.retryable > 0 ? "warning" : "neutral"} className="normal-case text-xs">
                    {e.retryable.toLocaleString()}
                  </Badge>
                </td>
              </tr>
            ))}
            {errors.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-ink-muted">
                  No failed run in this window.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const REAL_AUTONOMOUS_AGENTS = [
  {
    id: "document-intake",
    name: "Document Intake Agent",
    category: "Intake & Intelligence",
    icon: FileCheck2,
    regulation: "19 CFR § 141.86",
    description: "Automated document ingestion, packet stitching, and format normalization across commercial invoices, BOLs, and packing lists.",
    status: "ACTIVE",
  },
  {
    id: "document-intelligence",
    name: "Document Intelligence Agent",
    category: "Intake & Intelligence",
    icon: ScanText,
    regulation: "19 CFR § 141.89",
    description: "Deep multi-modal extraction of trade attributes, line item hierarchies, Incoterms, and MID builder.",
    status: "ACTIVE",
  },
  {
    id: "product-intelligence",
    name: "Product Intelligence Agent",
    category: "Intake & Intelligence",
    icon: Boxes,
    regulation: "GRI 1 & GRI 3",
    description: "Deterministic SKU/GTIN Product Master matching, material composition enrichment, and conflict detection.",
    status: "ACTIVE",
  },
  {
    id: "hts-classification",
    name: "HTS Classification Agent",
    category: "Classification & Tariff",
    icon: Scale,
    regulation: "19 U.S.C. § 1202",
    description: "Automated 10-digit HTS code resolution with legal GRI citations and CBP CROSS Customs Rulings vector search.",
    status: "ACTIVE",
  },
  {
    id: "origin-rules",
    name: "Origin & Trade Agreement Agent",
    category: "Classification & Tariff",
    icon: Globe2,
    regulation: "19 CFR Part 102 & Part 181",
    description: "Tariff shift rules engine (CC, CTH, CTSH), USMCA RVC calculations, and Section 301/232 exclusion analysis.",
    status: "ACTIVE",
  },
  {
    id: "valuation-assists",
    name: "Valuation & Assists Agent",
    category: "Classification & Tariff",
    icon: Calculator,
    regulation: "19 U.S.C. § 1401a",
    description: "CBP transaction valuation, tooling assist allocations, buyer rebates, and ocean freight deductions.",
    status: "ACTIVE",
  },
  {
    id: "compliance-audit",
    name: "Compliance & Audit Risk Agent",
    category: "Risk & Compliance Audit",
    icon: ShieldAlert,
    regulation: "19 U.S.C. § 1592",
    description: "50+ pre-filing compliance audit rules, PGA screening (FDA, EPA, FCC), ADD/CVD verification, and UFLPA screening.",
    status: "ACTIVE",
  },
  {
    id: "filing-readiness",
    name: "Filing Readiness Agent",
    category: "Risk & Compliance Audit",
    icon: CheckCircle2,
    regulation: "19 CFR § 141.61",
    description: "CBP Form 7501 field-level verification, continuous bond validation, and automated broker queue routing.",
    status: "ACTIVE",
  },
  {
    id: "customs-filing",
    name: "Customs Filing Agent",
    category: "ACE Filing & Response",
    icon: Send,
    regulation: "19 CFR Part 143",
    description: "Direct electronic ABI/ACE EDI transmission (Types 01, 11, 86, 06) and real-time CBP status listener.",
    status: "ACTIVE",
  },
  {
    id: "response-management",
    name: "Response & Post-Summary Agent",
    category: "ACE Filing & Response",
    icon: Receipt,
    regulation: "19 CFR § 173 & Part 190",
    description: "Post-entry event monitoring, CBP Form 28/29 legal response drafting, PSC filing, and Duty Drawback refunds.",
    status: "ACTIVE",
  },
];

function ActiveAgentsCatalog() {
  return (
    <div className="apple-card rounded-3xl border border-border bg-white shadow-sm overflow-hidden p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-600" />
            <span>Active Autonomous Agents Directory</span>
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            The 10 production-deployed AI agents powering end-to-end customs intake, tariff classification, compliance, and ACE filing.
          </p>
        </div>
        <Badge variant="success" className="text-xs font-bold px-3 py-1 self-start sm:self-auto">
          10 Active Autonomous Agents
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {REAL_AUTONOMOUS_AGENTS.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <div
              key={agent.id}
              className="p-4 rounded-2xl bg-surface-muted/60 border border-border hover:border-amber-500/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-ink block">{agent.name}</span>
                    <span className="text-[10px] text-ink-muted font-mono">{agent.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-border text-ink-muted">
                    {agent.regulation}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {agent.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed pl-9">{agent.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AgentsAnalyticsPanel({
  data,
  documentProcessing,
}: {
  data: AiUsageAnalytics;
  documentProcessing: DocumentProcessingAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={Zap}
          label="LLM Calls"
          value={data.totals.requests.toLocaleString()}
          footnote={`Last ${data.rangeDays} days, all surfaces`}
        />
        <StatTile
          icon={Gauge}
          label="Tokens Spent"
          value={formatCompactNumber(data.totals.totalTokens)}
          footnote={`${formatCompactNumber(data.totals.inputTokens)} in · ${formatCompactNumber(data.totals.outputTokens)} out`}
        />
        <StatTile
          icon={Users}
          label="Accounts Active"
          value={data.totals.accountsActive.toLocaleString()}
          footnote="Accounts that made at least one metered AI call"
        />
        <StatTile
          icon={Layers}
          label="Surfaces Active"
          value={`${data.totals.surfacesActive} / ${data.bySurface.length}`}
          footnote="Metered AI capabilities with at least one call"
        />
      </div>

      <ActiveAgentsCatalog />

      <UsageTrendChart daily={data.daily} />

      <SurfaceUsageTable bySurface={data.bySurface} totalTokens={data.totals.totalTokens} />

      <TopAccountsTable accounts={data.topAccounts} />

      <CopilotHealthSection data={data.copilot} />

      <DocumentProcessingSection data={documentProcessing} />

      <p className="text-[10px] text-ink-muted px-1">
        Call and token counts come from the shared <code>AiUsageWindow</code> metering table (day-level counters,
        retained for roughly 35 days). Chat assistant query health comes from the audit trail written on every{" "}
        <code>/chat</code> turn. Document processing figures come from <code>DocumentParseVersion</code>, one row per
        parse/extraction attempt; runs that never reported a confidence score or duration are excluded from those
        distributions rather than counted as zero. No cost or dollar figures are shown — this platform does not yet
        configure a per-token rate anywhere, and none is estimated here.
      </p>
    </div>
  );
}
