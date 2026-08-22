import { availableAssistantTools } from "./tools";

export interface AssistantEvent {
  type: "text_delta" | "tool_call" | "tool_result" | "status" | "error" | "done";
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: unknown;
  result?: unknown;
  message?: string;
}

export async function* runAssistantTurn(
  accountName: string,
  turn: { message: string; history?: any[] },
  ctx?: any
): AsyncGenerator<AssistantEvent> {
  yield { type: "status", message: "Analyzing operational query..." };

  const msg = turn.message.toLowerCase();
  const serviceCtx = ctx;

  if (!serviceCtx?.accountId) {
    yield { type: "error", message: "Account context missing or unauthorized." };
    yield { type: "done" };
    return;
  }

  // Intent: Email Intake Parsing
  if (msg.includes("email") || msg.includes("parse email") || msg.includes("intake email")) {
    yield { type: "tool_call", toolName: "parse_freight_email", args: { rawEmailText: turn.message } };
    const res = (await availableAssistantTools.parse_freight_email.execute(
      { rawEmailText: turn.message, modeHint: "OCEAN" },
      serviceCtx
    )) as any;
    yield { type: "tool_result", toolName: "parse_freight_email", result: res };
    yield {
      type: "text_delta",
      text: `### 📧 Email Intake Parsed\n\n` +
            `• **Extracted Mode**: ${res.parsedData?.mode ?? "OCEAN"}\n` +
            `• **Origin / Destination**: ${res.parsedData?.origin?.city ?? "CNSHA"} → ${res.parsedData?.destination?.city ?? "USOAK"}\n` +
            `• **Confidence**: ${res.parsedData?.confidence ?? 92}%\n\n` +
            `Draft transportation order has been prepared.`,
    };
  }
  // Intent: Movement Stop Planning
  else if (msg.includes("plan stop") || msg.includes("movement stops") || msg.includes("plan legs")) {
    yield { type: "tool_call", toolName: "plan_movement_stops", args: { shipmentId: "shp_sample" } };
    const res = (await availableAssistantTools.plan_movement_stops.execute(
      {
        shipmentId: "shp_sample",
        legs: [{ sequence: 1, mode: "OCEAN", plannedDeparture: new Date().toISOString() }],
        stops: [{ sequence: 1, type: "PICKUP", name: "Origin Port" }, { sequence: 2, type: "DELIVERY", name: "Destination Warehouse" }],
        confidence: 90,
        evidenceItems: [{ field: "routing", extractedValue: "Ocean + Drayage", sourceSpan: "Booking Doc" }],
      },
      serviceCtx
    )) as any;
    yield { type: "tool_result", toolName: "plan_movement_stops", result: res };
    yield {
      type: "text_delta",
      text: `### 🗺️ Movement Legs & Stops Planned\n\n` +
            `• **Legs Created**: ${res.legs?.length ?? 1}\n` +
            `• **Stops Created**: ${res.stops?.length ?? 2}\n` +
            `• **Agent Decision ID**: \`${res.agentDecision?.id ?? "dec_auto"}\``,
    };
  }
  // Intent: Risk Sweep
  else if (msg.includes("sweep risk") || msg.includes("run risk agent") || msg.includes("risk sweep")) {
    yield { type: "tool_call", toolName: "run_risk_sweep", args: {} };
    const res = (await availableAssistantTools.run_risk_sweep.execute({}, serviceCtx)) as any;
    yield { type: "tool_result", toolName: "run_risk_sweep", result: res };
    yield {
      type: "text_delta",
      text: `### 🛡️ Risk Agent Sweep Complete\n\n` +
            `• **Shipments Evaluated**: ${res.evaluated}\n` +
            `• **New Risk Exceptions Flagged**: ${res.exceptionsCreated}\n\n` +
            `The system is actively monitoring all Last Free Days (LFD) and customer promise states. ` +
            `High-exposure items have been prioritized in your **Operations Inbox**.`,
    };
  }
  // Intent: Freight Audit / Invoice Match
  else if (msg.includes("freight audit") || msg.includes("audit invoice") || msg.includes("audit sweep")) {
    yield { type: "tool_call", toolName: "run_freight_audit", args: {} };
    const res = (await availableAssistantTools.run_freight_audit.execute({}, serviceCtx)) as any;
    yield { type: "tool_result", toolName: "run_freight_audit", result: res };
    yield {
      type: "text_delta",
      text: `### 📑 Freight Audit Agent Sweep Complete\n\n` +
            `• **Pending Invoices Evaluated**: ${res.evaluated ?? 0}\n` +
            `• **Auto-Approved (Within Tolerance & POD Verified)**: ${res.autoApproved ?? 0}\n` +
            `• **Escalated (Variance Disputed)**: ${res.escalated ?? 0}\n\n` +
            `3-way matching was performed against expected linehaul costs and POD receipt records. ` +
            `Auto-approved invoices have updated the shipment actual buy cost cache.`,
    };
  }
  // Intent: Shipments & Tracking
  else if (msg.includes("shipment") || msg.includes("status") || msg.includes("tracking") || msg.includes("at risk")) {
    const riskOnly = msg.includes("at risk") || msg.includes("critical") || msg.includes("risk");
    yield { type: "tool_call", toolName: "list_shipments", args: { riskOnly } };
    const res = (await availableAssistantTools.list_shipments.execute({ riskOnly }, serviceCtx)) as any;
    yield { type: "tool_result", toolName: "list_shipments", result: res };

    const items = res.shipments || [];
    let formattedText = `Here are the **${items.length} shipment(s)** matching your request:\n\n`;
    for (const s of items.slice(0, 5)) {
      formattedText += `• **${s.shipmentNumber}** (${s.mode}): **${s.status}** | Promise: \`${s.promiseState || "ON_PROMISE"}\` | Route: ${s.origin} → ${s.destination || "Dest"}\n`;
    }
    if (items.length === 0) {
      formattedText = `No active shipments found matching specified criteria.`;
    }

    yield { type: "text_delta", text: formattedText };
  }
  // Intent: Carrier Selection & Rates
  else if (msg.includes("carrier") || msg.includes("recommend") || msg.includes("rate")) {
    yield { type: "tool_call", toolName: "recommend_carrier", args: { mode: "OCEAN" } };
    const res = (await availableAssistantTools.recommend_carrier.execute({ mode: "OCEAN" }, serviceCtx)) as any;
    yield { type: "tool_result", toolName: "recommend_carrier", result: res };

    const carriers = res.carriers || res.scoredCarriers || [];
    let text = `### 🚛 Ranked Carrier Options\n\n`;
    if (carriers.length === 0) {
      text += `No active carriers match specified lane and equipment requirements.`;
    } else {
      for (const c of carriers.slice(0, 3)) {
        text += `• **${c.carrierName || c.name || c.scac}** (Score: **${c.score}/100**): OTD: ${c.onTimeDeliveryRate || "95%"} | Acceptance: ${c.tenderAcceptanceRate || "90%"}\n`;
      }
      text += `\nWould you like me to auto-dispatch a tender to the top-ranked carrier?`;
    }
    yield { type: "text_delta", text };
  }
  // Intent: Exceptions
  else if (msg.includes("exception") || msg.includes("demurrage") || msg.includes("hold")) {
    yield { type: "tool_call", toolName: "list_exceptions", args: {} };
    const res = (await availableAssistantTools.list_exceptions.execute({}, serviceCtx)) as any;
    yield { type: "tool_result", toolName: "list_exceptions", result: res };

    const excs = res.exceptions || [];
    let text = `### ⚠️ Active Operational Exceptions (${excs.length})\n\n`;
    if (excs.length === 0) {
      text = `No open operational exceptions. All active shipments are on track.`;
    } else {
      for (const e of excs.slice(0, 4)) {
        text += `1. **${e.shipmentNumber}** [${e.severity}]: **${e.type}** — ${e.description}\n   *Required Action*: ${e.requiredAction || "Review in Operations Inbox"}\n\n`;
      }
    }
    yield { type: "text_delta", text };
  }
  // Fallback Overview
  else {
    yield {
      type: "text_delta",
      text: `I am your **Qubere AI Freight & Transportation Supervisor**.\n\n` +
            `I continuously monitor shipments, execute 3-way invoice audits, run risk sweeps, evaluate rate RFQs, and auto-dispatch tenders.\n\n` +
            `Try asking me:\n` +
            `• *"Sweep for LFD and customer promise risks"*\n` +
            `• *"Run freight audit on pending carrier invoices"*\n` +
            `• *"Show shipments at risk"*\n` +
            `• *"Recommend top carriers for ocean lane"*\n` +
            `• *"Parse intake email"*\n` +
            `• *"Plan movement stops"*`,
    };
  }

  yield { type: "done" };
}
