export type WorkItemKind =
  | "decision"
  | "finding"
  | "filing"
  | "document"
  | "exception"
  | "tender"
  | "carrier_invoice";

export type WorkPriority = "critical" | "high" | "normal";

export interface UrgencyContext {
  deadlineType: string;
  dueAt: Date;
  msRemaining: number;
  breached: boolean;
  estimated: boolean;
  exposureUsd: number | null;
}

export interface WorkItem {
  id: string;
  kind: WorkItemKind;
  title: string;
  reason: string;
  href: string;
  priority: WorkPriority;
  score: number;
  createdAt: Date;
  shipmentNumber: string | null;
  assignedToMe: boolean;
  filingDeadline: Date | null;
  urgency: UrgencyContext | null;
}
