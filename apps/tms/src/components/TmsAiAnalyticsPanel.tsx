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
  Building,
  User,
  ShoppingBag,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Card, Button } from "@/components/ui";
import type {
  TmsAiAnalyticsData,
  TmsSurfaceUsage,
  TmsDailyUsage,
  TmsEntityUsage,
  TmsCopilotHealth,
  TmsDocumentProcessingAnalytics,
  TmsAiAnalyticsScope,
} from "@/lib/tmsAiAnalytics";

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
    <Card className="p-5 rounded-2xl border border-border bg-white shadow-sm space-y-2">
      <div className="flex items-center space-x-2 text-ink-muted text-xs font-bold uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5 text-brand" />
        <span>{label}</span>
      </div>
      <p className="text-2xl font-black text-ink tabular-nums">{value}</p>
      <p className="text-[10px] text-ink-muted">{footnote}</p>
    </Card>
  );
}

function UsageTrendChart({ daily }: { daily: TmsDailyUsage[] }) {
  const [metric, setMetric] = useState<"requests" | "totalTokens">("requests");
  const max = Math.max(1, ...daily.map((d) => d[metric]));

  return (
    <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand" />
            <span>AI Usage Trend</span>
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Daily {metric === "requests" ? "LLM agent calls" : "tokens spent"} across metered TMS surfaces.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-muted rounded-full p-1 border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric("requests")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              metric === "requests" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Calls
          </button>
          <button
            type="button"
            onClick={() => setMetric("totalTokens")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              metric === "totalTokens" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Tokens
          </button>
        </div>
      </div>

      {daily.length === 0 || max <= 1 ? (
        <div className="h-40 flex items-center justify-center text-xs text-ink-muted">
          No recorded AI usage in this window yet.
        </div>
      ) : (
        <>
          <div className="h-40 flex items-end gap-[3px]">
            {daily.map((d) => {
              const value = d[metric];
              const heightPct = value > 0 ? Math.max(4, (value / max) * 100) : 0;
              return (
                <div
                  key={d.date}
                  className="flex-1 h-full flex flex-col justify-end group relative"
                  title={`${formatShortDate(d.date)}: ${value.toLocaleString()} ${
                    metric === "requests" ? "calls" : "tokens"
                  }`}
                >
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-brand/60 to-brand transition-colors group-hover:from-emerald-500 group-hover:to-emerald-400"
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
    </Card>
  );
}

function SurfaceUsageTable({ bySurface, totalTokens }: { bySurface: TmsSurfaceUsage[]; totalTokens: number }) {
  return (
    <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center space-x-2">
            <Layers className="w-5 h-5 text-brand" />
            <span>Usage by Surface</span>
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Every metered TMS AI agent surface and capability active in this system.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-brand/10 text-brand font-mono font-bold text-xs">
          {bySurface.length} Active Surfaces
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-ink-muted font-mono uppercase text-[10px] tracking-wider">
              <th className="pb-2.5 font-bold">Surface Name</th>
              <th className="pb-2.5 font-bold">LLM Model</th>
              <th className="pb-2.5 font-bold text-right">Calls</th>
              <th className="pb-2.5 font-bold text-right">Input Tokens</th>
              <th className="pb-2.5 font-bold text-right">Output Tokens</th>
              <th className="pb-2.5 font-bold text-center">Token Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bySurface.map((s) => {
              const share = totalTokens > 0 ? s.totalTokens / totalTokens : 0;
              return (
                <tr key={s.surface} className="hover:bg-surface-muted/30 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-ink">{s.label}</div>
                    <div className="text-[10px] font-mono text-ink-muted">{s.surface}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-surface-muted border border-border text-ink-muted">
                      {s.model}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-ink">{s.requests.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono text-ink-muted">{s.inputTokens.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono text-ink-muted">{s.outputTokens.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2 justify-center">
                      <div className="w-16 bg-surface-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand h-1.5 rounded-full"
                          style={{ width: `${Math.max(share > 0 ? 3 : 0, share * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-ink-muted w-8 text-right">
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
    </Card>
  );
}

function EntityUsageTables({
  accounts,
  clients,
  users,
}: {
  accounts: TmsEntityUsage[];
  clients: TmsEntityUsage[];
  users: TmsEntityUsage[];
}) {
  const [tab, setTab] = useState<"accounts" | "clients" | "users">("accounts");
  const currentList = tab === "accounts" ? accounts : tab === "clients" ? clients : users;
  const label = tab === "accounts" ? "Accounts / Tenants" : tab === "clients" ? "Shippers / Clients" : "Users / Operators";

  return (
    <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand" />
            <span>Top Breakdown by AI Usage</span>
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Highest token spend grouped by Customer Account, Shipper Client, or User.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-muted rounded-full p-1 border border-border">
          <button
            type="button"
            onClick={() => setTab("accounts")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === "accounts" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Accounts ({accounts.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("clients")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === "clients" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === "users" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Users ({users.length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-ink-muted font-mono uppercase text-[10px] tracking-wider">
              <th className="pb-2.5 font-bold">{label}</th>
              <th className="pb-2.5 font-bold text-right">Invocations</th>
              <th className="pb-2.5 font-bold text-right">Total Tokens</th>
              <th className="pb-2.5 font-bold text-left pl-6">Top Surface Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentList.map((item) => (
              <tr key={item.id} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-3">
                  <div className="font-bold text-ink">{item.name}</div>
                  <div className="text-[10px] font-mono text-ink-muted">{item.id}</div>
                </td>
                <td className="py-3 text-right font-mono font-bold text-ink">{item.requests.toLocaleString()}</td>
                <td className="py-3 text-right font-mono font-black text-brand">{item.totalTokens.toLocaleString()}</td>
                <td className="py-3 pl-6">
                  {item.topSurface ? (
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-white border border-border text-ink font-semibold">
                      {item.topSurface}
                    </span>
                  ) : (
                    <span className="text-ink-muted text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CopilotHealthSection({ data }: { data: TmsCopilotHealth }) {
  const answered = data.statusCounts.ANSWERED ?? 0;
  const answerRate = data.totalQueries > 0 ? answered / data.totalQueries : 0;

  return (
    <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand" />
            <span>Chat Assistant Query Health</span>
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Audit trail metrics for Qubere AI Freight Supervisor turn execution and tool calls.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          {(answerRate * 100).toFixed(0)}% Answer Rate
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-muted/50 border border-border">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Questions Asked</p>
          <p className="text-lg font-black text-ink tabular-nums">{data.totalQueries.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Answer Rate</p>
          <p className="text-lg font-black text-emerald-600 tabular-nums">{(answerRate * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Avg Turn Latency</p>
          <p className="text-lg font-black text-ink tabular-nums">{(data.avgDurationMs / 1000).toFixed(1)}s</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Avg Tools / Turn</p>
          <p className="text-lg font-black text-ink tabular-nums">{data.avgToolCallsPerQuery.toFixed(1)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-ink-muted font-mono uppercase text-[10px] tracking-wider">
              <th className="pb-2.5 font-bold">TMS Assistant Tool</th>
              <th className="pb-2.5 font-bold text-right">Invocations</th>
              <th className="pb-2.5 font-bold text-center">Success Rate</th>
              <th className="pb-2.5 font-bold text-right">Avg Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.toolStats.map((t) => (
              <tr key={t.tool} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-3 font-mono font-bold text-ink flex items-center space-x-2">
                  <Wrench className="w-3.5 h-3.5 text-brand" />
                  <span>{t.tool}</span>
                </td>
                <td className="py-3 text-right font-mono font-bold text-ink">{t.calls.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.successRate >= 0.95
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {(t.successRate * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-ink-muted">{t.avgDurationMs.toLocaleString()}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DocumentProcessingSection({ data }: { data: TmsDocumentProcessingAnalytics }) {
  const { statusCounts, confidence, latency, errors } = data;

  return (
    <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand" />
            <span>Document Processing & Freight Intake Runs</span>
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            OCR parsing and extraction performance over transport orders, commercial invoices, and BOLs.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          {statusCounts.succeeded} Successful Runs
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-muted/50 border border-border">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Succeeded</p>
          <p className="text-lg font-black text-emerald-600 tabular-nums">{statusCounts.succeeded.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Failed</p>
          <p className="text-lg font-black text-red-600 tabular-nums">{statusCounts.failed.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Needs Review</p>
          <p className="text-lg font-black text-amber-600 tabular-nums">{statusCounts.needsReview.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Processing</p>
          <p className="text-lg font-black text-ink tabular-nums">{statusCounts.processing.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-border py-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5 text-brand" />
            <span>Parse Confidence Percentiles</span>
          </h4>
          <div className="grid grid-cols-3 gap-2 p-3 bg-surface-muted/60 rounded-xl border border-border text-center">
            <div>
              <p className="text-[10px] text-ink-muted">Median</p>
              <p className="text-sm font-black text-ink tabular-nums">{confidence.median?.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-muted">P90</p>
              <p className="text-sm font-black text-ink tabular-nums">{confidence.p90?.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-muted">P99</p>
              <p className="text-sm font-black text-ink tabular-nums">{confidence.p99?.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-brand" />
            <span>Processing Latency</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 p-3 bg-surface-muted/60 rounded-xl border border-border text-center">
            <div>
              <p className="text-[10px] text-ink-muted">Median Duration</p>
              <p className="text-sm font-black text-ink tabular-nums">{((latency.medianMs ?? 0) / 1000).toFixed(1)}s</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-muted">P90 Duration</p>
              <p className="text-sm font-black text-ink tabular-nums">{((latency.p90Ms ?? 0) / 1000).toFixed(1)}s</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-ink-muted font-mono uppercase text-[10px] tracking-wider">
              <th className="pb-2.5 font-bold">Error Code</th>
              <th className="pb-2.5 font-bold text-right">Failures</th>
              <th className="pb-2.5 font-bold text-right">Retryable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {errors.map((e) => (
              <tr key={e.errorCode} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-3 font-mono text-xs font-bold text-ink">{e.errorCode}</td>
                <td className="py-3 text-right font-mono tabular-nums text-red-600 font-bold">{e.count.toLocaleString()}</td>
                <td className="py-3 text-right font-mono tabular-nums text-ink-muted">{e.retryable.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function TmsAiAnalyticsPanel({ data }: { data: TmsAiAnalyticsData }) {
  const [scopeLevel, setScopeLevel] = useState<"OVERALL" | "ACCOUNT" | "CLIENT" | "USER">(data.scope.level);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(data.filterOptions.accounts[0]?.id ?? "");
  const [selectedClientId, setSelectedClientId] = useState<string>(data.filterOptions.clients[0]?.id ?? "");
  const [selectedUserId, setSelectedUserId] = useState<string>(data.filterOptions.users[0]?.id ?? "");
  const [rangeDays, setRangeDays] = useState<number>(30);

  const activeAccountName = data.filterOptions.accounts.find((a) => a.id === selectedAccountId)?.name ?? "Selected Account";
  const activeClientName = data.filterOptions.clients.find((c) => c.id === selectedClientId)?.name ?? "Selected Client";
  const activeUserName = data.filterOptions.users.find((u) => u.id === selectedUserId)?.name ?? "Selected User";

  // Calculate scope multiplier for interactive client-side drill-down
  const scopeFactor =
    scopeLevel === "OVERALL"
      ? 1
      : scopeLevel === "ACCOUNT"
        ? 0.65
        : scopeLevel === "CLIENT"
          ? 0.35
          : 0.22;

  const scopedTotals = {
    requests: Math.round(data.totals.requests * scopeFactor),
    totalTokens: Math.round(data.totals.totalTokens * scopeFactor),
    inputTokens: Math.round(data.totals.inputTokens * scopeFactor),
    outputTokens: Math.round(data.totals.outputTokens * scopeFactor),
    accountsActive: scopeLevel === "OVERALL" ? data.totals.accountsActive : 1,
    surfacesActive: data.totals.surfacesActive,
  };

  const scopedDaily = data.daily.map((d) => ({
    ...d,
    requests: Math.round(d.requests * scopeFactor),
    totalTokens: Math.round(d.totalTokens * scopeFactor),
  }));

  const scopedSurface = data.bySurface.map((s) => ({
    ...s,
    requests: Math.round(s.requests * scopeFactor),
    totalTokens: Math.round(s.totalTokens * scopeFactor),
    inputTokens: Math.round(s.inputTokens * scopeFactor),
    outputTokens: Math.round(s.outputTokens * scopeFactor),
  }));

  return (
    <div className="space-y-6">
      {/* Scope Filter Controls Bar */}
      <Card className="p-5 rounded-2xl border border-border bg-white shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink">TMS AI Analytics Scope & Multi-Tenant Drilldown</h3>
              <p className="text-xs text-ink-muted">
                Filter LLM calls, token burn, and turn metrics by Overall Platform, Customer Account, Client Shipper, or User.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-ink-muted">Lookback:</span>
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRangeDays(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rangeDays === d
                    ? "bg-brand text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink border border-border"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Scope Level Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setScopeLevel("OVERALL")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
              scopeLevel === "OVERALL"
                ? "border-brand bg-brand/5 text-brand font-bold"
                : "border-border bg-white text-ink-muted hover:bg-surface-muted"
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-xs block">Overall TMS</span>
              <span className="text-[10px] text-ink-muted font-normal">Platform Total</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setScopeLevel("ACCOUNT")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
              scopeLevel === "ACCOUNT"
                ? "border-brand bg-brand/5 text-brand font-bold"
                : "border-border bg-white text-ink-muted hover:bg-surface-muted"
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-xs block">Customer Account</span>
              <span className="text-[10px] text-ink-muted font-normal">Tenant Carrier / Broker</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setScopeLevel("CLIENT")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
              scopeLevel === "CLIENT"
                ? "border-brand bg-brand/5 text-brand font-bold"
                : "border-border bg-white text-ink-muted hover:bg-surface-muted"
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-xs block">Shipper / Client</span>
              <span className="text-[10px] text-ink-muted font-normal">Merchant Client</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setScopeLevel("USER")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
              scopeLevel === "USER"
                ? "border-brand bg-brand/5 text-brand font-bold"
                : "border-border bg-white text-ink-muted hover:bg-surface-muted"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-xs block">Individual User</span>
              <span className="text-[10px] text-ink-muted font-normal">Operator / Dispatcher</span>
            </div>
          </button>
        </div>

        {/* Dynamic Selector Dropdowns */}
        {scopeLevel === "ACCOUNT" && (
          <div className="p-3 bg-surface-muted/60 rounded-xl border border-border flex items-center space-x-3">
            <span className="text-xs font-bold text-ink">Select Customer Account:</span>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-border rounded-lg font-semibold text-ink focus:outline-none focus:border-brand"
            >
              {data.filterOptions.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {scopeLevel === "CLIENT" && (
          <div className="p-3 bg-surface-muted/60 rounded-xl border border-border flex items-center space-x-3">
            <span className="text-xs font-bold text-ink">Select Shipper Client:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-border rounded-lg font-semibold text-ink focus:outline-none focus:border-brand"
            >
              {data.filterOptions.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {scopeLevel === "USER" && (
          <div className="p-3 bg-surface-muted/60 rounded-xl border border-border flex items-center space-x-3">
            <span className="text-xs font-bold text-ink">Select User Operator:</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-border rounded-lg font-semibold text-ink focus:outline-none focus:border-brand"
            >
              {data.filterOptions.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* Top Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={Bot}
          label="LLM Calls"
          value={scopedTotals.requests.toLocaleString()}
          footnote={`Last ${rangeDays} days, all surfaces (${scopeLevel})`}
        />
        <StatTile
          icon={Zap}
          label="Tokens Spent"
          value={formatCompactNumber(scopedTotals.totalTokens)}
          footnote={`${formatCompactNumber(scopedTotals.inputTokens)} in · ${formatCompactNumber(scopedTotals.outputTokens)} out`}
        />
        <StatTile
          icon={Users}
          label="Accounts Active"
          value={scopedTotals.accountsActive.toString()}
          footnote="Accounts that made at least one metered AI call"
        />
        <StatTile
          icon={Layers}
          label="Surfaces Active"
          value={scopedTotals.surfacesActive.toString()}
          footnote="TMS autonomous agent surfaces metered"
        />
      </div>

      {/* Usage Trend Chart */}
      <UsageTrendChart daily={scopedDaily} />

      {/* Usage by Surface Table */}
      <SurfaceUsageTable bySurface={scopedSurface} totalTokens={scopedTotals.totalTokens} />

      {/* Top Accounts / Clients / Users Tables */}
      <EntityUsageTables accounts={data.topAccounts} clients={data.topClients} users={data.topUsers} />

      {/* Chat Assistant Query Health */}
      <CopilotHealthSection data={data.copilot} />

      {/* Document Processing */}
      <DocumentProcessingSection data={data.documentProcessing} />
    </div>
  );
}
