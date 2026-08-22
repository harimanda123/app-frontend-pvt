"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen, Search, ArrowRight, ExternalLink, Bot, Truck, FileText, Receipt,
  ShieldCheck, ArrowUpRight, Cpu, Layers, Sparkles, CheckCircle2, HelpCircle,
  BarChart3, Scale, Clock, AlertTriangle, Zap, Terminal, Command
} from "lucide-react";
import { TmsSidebar } from "@/components/TmsSidebar";
import { TmsHeader } from "@/components/TmsHeader";
import { Card, Badge, Button } from "@/components/ui";

interface FeatureGuideItem {
  id: string;
  title: string;
  category: "Intake & Orders" | "Tenders & Rating" | "Shipments & Tracking" | "Freight Audit" | "AI Supervisor & Admin";
  icon: any;
  route: string;
  badge: string;
  summary: string;
  keyCapabilities: string[];
  howToSteps: { stepNumber: number; title: string; instruction: string }[];
  proTip?: string;
}

const FEATURE_GUIDE_DATA: FeatureGuideItem[] = [
  {
    id: "action-workbench",
    title: "Action & Exceptions Workbench",
    category: "Shipments & Tracking",
    icon: AlertTriangle,
    route: "/",
    badge: "Command Center",
    summary: "Real-time exception queue prioritizing high-risk freight shipments requiring human dispatcher review or approval.",
    keyCapabilities: [
      "Automated risk scoring (Critical, High, Warning)",
      "Carrier tender dispatch SLA timeout detection",
      "Demurrage & Last Free Day (LFD) expiration alerts",
      "One-click action resolution with signed audit trail",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Navigate to Command Center", instruction: "Click Home or Action Workbench from the sidebar menu." },
      { stepNumber: 2, title: "Select High-Risk Shipment", instruction: "Click any blocked shipment card on the left panel (sorted by urgency)." },
      { stepNumber: 3, title: "Review AI Recommendation", instruction: "Inspect what happened, why it matters, and Qubere AI's recommended action." },
      { stepNumber: 4, title: "Execute Resolution", instruction: "Click 'Re-Tender Carrier' or 'Approve Action' to automatically sign and dispatch." },
    ],
    proTip: "You can filter shipments by category (Blocked, Needs Review, Verified) using the categorization stat tiles.",
  },
  {
    id: "freight-intake",
    title: "Inbound Freight Orders & Intake",
    category: "Intake & Orders",
    icon: FileText,
    route: "/orders",
    badge: "Multi-Modal OCR",
    summary: "Automated ingestion and AI extraction of transportation orders, PDF rate confirmations, customer emails, and EDI 204 packets.",
    keyCapabilities: [
      "Multi-modal OCR for PDF, image, and raw email text",
      "Automatic origin/destination port and stop parsing",
      "Equipment requirement detection (53' Dry Van, Reefer, Flatbed, Container Dray)",
      "Instant promotion into active shipment execution records",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Open Orders Intake", instruction: "Navigate to 'Orders & Intake' from the sidebar." },
      { stepNumber: 2, title: "Paste or Upload Order", instruction: "Click 'Ingest Order' and drop a PDF rate sheet or paste email text." },
      { stepNumber: 3, title: "Review Extracted Attributes", instruction: "Verify Parsed Confidence score, commodity details, and stop locations." },
      { stepNumber: 4, title: "Promote to Active Shipment", instruction: "Click 'Promote Order' to generate an active tracking shipment." },
    ],
    proTip: "The intake agent automatically extracts pickup windows, hazmat flags, and temperature constraints.",
  },
  {
    id: "carrier-tendering",
    title: "Carrier Rating & Tender Dispatch",
    category: "Tenders & Rating",
    icon: Truck,
    route: "/tenders",
    badge: "Waterfall Engine",
    summary: "Automated freight quote rating, contract tariff matching, and waterfall carrier tender dispatch with SLA monitoring.",
    keyCapabilities: [
      "Dynamic rate calculation ($/mile linehaul + FSC)",
      "Waterfall carrier dispatch (Primary ➔ Secondary ➔ Tertiary)",
      "60-minute tender response timeout SLA monitoring",
      "Spot rate RFQ generation for uncontracted lanes",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Access Tenders & Spot Quotes", instruction: "Select 'Tenders & Spot Quotes' from the sidebar." },
      { stepNumber: 2, title: "Review Active Waterfall Tenders", instruction: "View load tender statuses (Dispatched, Acknowledged, Timed Out)." },
      { stepNumber: 3, title: "Trigger Waterfall Re-Tender", instruction: "If primary carrier times out, click 'Auto-Tender Next Carrier'." },
      { stepNumber: 4, title: "Evaluate Spot Rate Proposals", instruction: "Compare spot market quotes against historical contract baselines." },
    ],
    proTip: "Tender dispatch policies follow 49 CFR § 395.3 HOS safety guidelines to ensure driver compliance.",
  },
  {
    id: "shipments-telematics",
    title: "Shipments Control Tower & Telematics",
    category: "Shipments & Tracking",
    icon: Layers,
    route: "/shipments",
    badge: "GPS & Telematics",
    summary: "Full lifecycle tracking dashboard for ocean, drayage, truckload, and rail freight shipments across all customer accounts.",
    keyCapabilities: [
      "Real-time GPS telematics and EDI 214 status event stream",
      "Port container Last Free Day (LFD) demurrage countdown",
      "Interactive multi-stop leg map and milestone tracking",
      "Dynamic customer promise date recalculation",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Open Shipments Workbench", instruction: "Click 'Shipments & Tracking' on the sidebar." },
      { stepNumber: 2, title: "Filter by Status or Mode", instruction: "Use filters for Mode (Ocean, Truckload, Dray) or Risk Status." },
      { stepNumber: 3, title: "Open Shipment Workspace", instruction: "Click any shipment number (e.g. SHP-2026-000002) to open its detail view." },
      { stepNumber: 4, title: "Manage Stops & Documents", instruction: "Inspect leg timeline, driver assignment, POD uploads, and financials." },
    ],
    proTip: "Demurrage risk highlights containers approaching Last Free Day to avoid $350/day terminal penalties.",
  },
  {
    id: "freight-audit",
    title: "3-Way Linehaul & FSC Freight Audit",
    category: "Freight Audit",
    icon: Receipt,
    route: "/invoices",
    badge: "Automated 3-Way Match",
    summary: "Automated reconciliation of carrier linehaul invoices, fuel surcharges (FSC), and accessorial fees against contracted tariffs and proof of delivery.",
    keyCapabilities: [
      "Linehaul & FSC contract rate sheet comparison",
      "Proof of Delivery (POD) presence & signature verification",
      "Automated price variance detection (>5% variance flag)",
      "Batch invoice approval and payment queue settlement",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Navigate to Freight Invoices", instruction: "Click 'Freight Audit & Invoices' on the sidebar." },
      { stepNumber: 2, title: "Run Audit Sweep", instruction: "Click 'Run 3-Way Audit Sweep' to evaluate all pending carrier invoices." },
      { stepNumber: 3, title: "Review Discrepancies", instruction: "Inspect flagged items showing rate variance or missing PODs." },
      { stepNumber: 4, title: "Approve Payment", instruction: "Approve verified 3-way matches for automated accounting export." },
    ],
    proTip: "3-Way match requires verified Proof of Delivery before carrier settlement is authorized.",
  },
  {
    id: "ai-supervisor",
    title: "Qubere Autonomous AI Freight Supervisor",
    category: "AI Supervisor & Admin",
    icon: Bot,
    route: "/chat",
    badge: "Gemini 2.5 Copilot",
    summary: "Conversational AI assistant capable of executing tools across shipments, rate sheets, carrier tenders, and exception resolution.",
    keyCapabilities: [
      "Natural language querying ('Which shipments are at risk of demurrage today?')",
      "Direct tool execution (`search_shipments`, `recommend_carrier`, `plan_movement_stops`)",
      "Context-aware freight memory and customer instruction lookup",
      "Multi-modal document question answering",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Launch AI Copilot", instruction: "Click 'AI Supervisor Copilot' from the sidebar or header." },
      { stepNumber: 2, title: "Ask a Natural Language Question", instruction: "Type queries like 'Find carriers for LAX to Chicago with rate under $2,500'." },
      { stepNumber: 3, title: "Inspect Tool Execution", instruction: "View structured tool call arguments and live database response cards." },
      { stepNumber: 4, title: "Execute Action Directly", instruction: "Click action buttons inside assistant responses to dispatch or update." },
    ],
    proTip: "You can ask the AI Supervisor to draft carrier emails or recalculate demurrage exposure in real-time.",
  },
  {
    id: "admin-analytics",
    title: "TMS Admin Workbench & Metered AI Analytics",
    category: "AI Supervisor & Admin",
    icon: BarChart3,
    route: "/admin",
    badge: "Multi-Scoped Telemetry",
    summary: "Comprehensive administration dashboard featuring multi-scoped AI token metering, copilot query health, document processing runs, roles, and API integrations.",
    keyCapabilities: [
      "Multi-scoped AI usage metering (Overall TMS, Customer Account, Client, User)",
      "Daily token burn trend charts and agent surface usage breakdown",
      "Chat assistant turn health & tool execution metrics",
      "Document OCR processing confidence & failure diagnostics",
    ],
    howToSteps: [
      { stepNumber: 1, title: "Open TMS Admin Console", instruction: "Navigate to 'TMS Admin & Workbench' from the sidebar." },
      { stepNumber: 2, title: "Select Agents & Telemetry Tab", instruction: "Click the '🤖 AI Freight Agents & Telemetry' tab." },
      { stepNumber: 3, title: "Apply Multi-Level Scoping", instruction: "Toggle scope filters between Overall TMS, Customer Account, or User." },
      { stepNumber: 4, title: "Inspect Token & Tool Performance", instruction: "Review LLM calls, token breakdown by surface, and OCR confidence." },
    ],
    proTip: "Admin workbench allows managing tenant organization profiles, API keys, and background cron schedules.",
  },
];

export function GuideClient() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Intake & Orders", "Tenders & Rating", "Shipments & Tracking", "Freight Audit", "AI Supervisor & Admin"];

  const filteredFeatures = useMemo(() => {
    return FEATURE_GUIDE_DATA.filter((feat) => {
      const matchesCategory = activeCategory === "All" || feat.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        feat.title.toLowerCase().includes(q) ||
        feat.summary.toLowerCase().includes(q) ||
        feat.keyCapabilities.some((c) => c.toLowerCase().includes(q)) ||
        feat.howToSteps.some((s) => s.title.toLowerCase().includes(q) || s.instruction.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-surface-muted text-ink flex w-full">
      <TmsSidebar accountName="Enterprise Freight" />

      <div className="flex-1 flex flex-col min-w-0">
        <TmsHeader tenantName="Enterprise Freight" userName="Operations Lead" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-[1600px] mx-auto w-full">
          {/* HERO BANNER */}
          <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-800 space-y-6">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-brand/20 text-brand border border-brand/30 font-mono font-bold text-xs">
                    Qubere TMS • Platform User Guide v2.5
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    Production Ready
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                  Welcome to Qubere Autonomous TMS
                </h1>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                  Everything you need to master autonomous freight intake, waterfall carrier tendering, real-time telematics tracking, Last Free Day demurrage prevention, and 3-way invoice auditing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-xs hover:bg-brand-hover transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Go to Workbench</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/chat"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-xs hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Bot className="w-4 h-4 text-brand" />
                  <span>Launch AI Supervisor</span>
                </Link>
              </div>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-white text-slate-950 shadow-sm"
                        : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search features, workflows, or tools…"
                  className="pl-10 pr-4 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl focus:outline-none focus:border-brand focus:bg-slate-900 text-white placeholder-slate-400 w-full md:w-72 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* QUICK ROUTE DIRECTORY */}
          <Card className="p-6 bg-white border border-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-ink flex items-center space-x-2">
                <Command className="w-4 h-4 text-brand" />
                <span>Instant Route Directory</span>
              </h2>
              <span className="text-xs text-ink-muted font-mono font-semibold">6 Core Access Points</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "Command Center", path: "/", desc: "High-risk exception queue & decisions", icon: AlertTriangle },
                { title: "Orders & Intake", path: "/orders", desc: "OCR PDF & Email order parser", icon: FileText },
                { title: "Tenders & Rating", path: "/tenders", desc: "Waterfall carrier tender engine", icon: Truck },
                { title: "Shipments Control", path: "/shipments", desc: "Telematics, LFD & container maps", icon: Layers },
                { title: "Freight Audit", path: "/invoices", desc: "3-Way linehaul & FSC invoice match", icon: Receipt },
                { title: "TMS Admin", path: "/admin", desc: "AI telemetry & system settings", icon: BarChart3 },
              ].map((routeItem) => {
                const IconComponent = routeItem.icon;
                return (
                  <Link
                    key={routeItem.path}
                    href={routeItem.path}
                    className="p-3.5 rounded-2xl bg-surface-muted/50 border border-border hover:border-brand/40 hover:bg-white transition-all group space-y-1 block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-ink group-hover:text-brand transition-colors">
                          {routeItem.title}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-colors" />
                    </div>
                    <p className="text-[11px] text-ink-muted leading-relaxed pl-9">{routeItem.desc}</p>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* FEATURE CARDS LIST */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-ink tracking-tight flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-brand" />
                <span>TMS Core Features & Step-by-Step How-To</span>
              </h2>
              <span className="text-xs font-mono text-ink-muted font-semibold">
                Showing {filteredFeatures.length} of {FEATURE_GUIDE_DATA.length} Features
              </span>
            </div>

            <div className="space-y-6">
              {filteredFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={feature.id} className="p-6 bg-white border border-border shadow-2xs space-y-5">
                    {/* Feature Title Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-base font-black text-ink">{feature.title}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-brand/10 text-brand">
                              {feature.badge}
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5">{feature.summary}</p>
                        </div>
                      </div>

                      <Link
                        href={feature.route}
                        className="px-4 py-2 rounded-xl bg-surface-muted border border-border text-xs font-bold text-brand hover:bg-brand hover:text-white transition-all inline-flex items-center justify-center space-x-1.5 self-start sm:self-auto shrink-0"
                      >
                        <span>Open Feature</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Capabilities & Step-by-step How-to Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Key Capabilities (5 cols) */}
                      <div className="lg:col-span-5 space-y-3 bg-surface-muted/40 p-4 rounded-2xl border border-border">
                        <h4 className="text-xs font-black uppercase tracking-wider text-ink flex items-center space-x-1.5">
                          <Zap className="w-3.5 h-3.5 text-brand" />
                          <span>Key Capabilities</span>
                        </h4>
                        <ul className="space-y-2">
                          {feature.keyCapabilities.map((cap, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-xs text-ink-muted">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: How to Use (7 cols) */}
                      <div className="lg:col-span-7 space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-ink flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>How to Use (Step-by-Step)</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {feature.howToSteps.map((step) => (
                            <div key={step.stepNumber} className="p-3.5 rounded-xl bg-white border border-border space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-brand text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {step.stepNumber}
                                </span>
                                <span className="font-bold text-xs text-ink">{step.title}</span>
                              </div>
                              <p className="text-[11px] text-ink-muted leading-relaxed pl-7">{step.instruction}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pro Tip Callout Banner */}
                    {feature.proTip && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-amber-950">Pro Tip: </strong>
                          <span className="text-amber-900 leading-relaxed">{feature.proTip}</span>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* KEYBOARD SHORTCUTS CHEAT SHEET */}
          <Card className="p-6 bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Command className="w-4 h-4 text-brand" />
                <span>Keyboard Shortcuts & Power User Controls</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Shortcuts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { keyCombo: "⌘ / Ctrl + K", action: "Global Freight Search" },
                { keyCombo: "Shift + H", action: "Jump to Home Workbench" },
                { keyCombo: "Shift + O", action: "Open Freight Orders Intake" },
                { keyCombo: "Shift + T", action: "Open Tenders & Rating" },
                { keyCombo: "Shift + S", action: "Open Shipments Workbench" },
                { keyCombo: "Shift + I", action: "Open Freight Invoices Audit" },
                { keyCombo: "Shift + C", action: "Launch AI Copilot Chat" },
                { keyCombo: "Shift + A", action: "Open TMS Admin Console" },
              ].map((shortcut) => (
                <div key={shortcut.keyCombo} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">{shortcut.action}</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 text-brand font-mono font-bold text-[10px] border border-slate-700">
                    {shortcut.keyCombo}
                  </kbd>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
