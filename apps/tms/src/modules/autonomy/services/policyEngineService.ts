import { db } from "@qubere/db";
import type { AccountContext } from "@qubere/auth";

export interface AutonomyPolicyConfig {
  // Core policy
  maxFinancialCommitment: number;
  minAutoConfidence: number;
  allowedAutoActions: string[];
  forbiddenAutoActions: string[];
  // TMS autonomy extensions
  autonomyMode: "SUPERVISED" | "BALANCED" | "AUTONOMOUS" | "CUSTOM";
  financialThreshold: number | null;
  marginThreshold: number | null;
  carrierApprovalRequired: boolean;
  requireInsurance: boolean;
  requireCustomsRelease: boolean;
  requireHumanApproval: boolean;
}

export const DEFAULT_AUTONOMY_POLICY: AutonomyPolicyConfig = {
  maxFinancialCommitment: 5000,
  minAutoConfidence: 80.0,
  allowedAutoActions: [
    "AUTO_QUOTE",
    "QUOTE_APPROVE",
    "AUTO_TENDER",
    "TENDER_DISPATCH",
    "AUTO_NOTIFY_CUSTOMER",
    "AUTO_RESCHEDULE",
    "UPDATE_ETA",
    "RESOLVE_EXCEPTION",
  ],
  forbiddenAutoActions: [
    "CUSTOMS_HOLD_OVERRIDE",
    "UNVERIFIED_INVOICE_PAYMENT",
    "MANUAL_ENTRY_OVERRIDE",
  ],
  autonomyMode: "BALANCED",
  financialThreshold: 5000,
  marginThreshold: 10.0,
  carrierApprovalRequired: false,
  requireInsurance: true,
  requireCustomsRelease: true,
  requireHumanApproval: false,
};

/**
 * Loads the per-account, per-agent policy from DB (AgentPolicyConfig).
 * Falls back to DEFAULT_AUTONOMY_POLICY when no DB row exists — this preserves
 * the pre-TMS behavior for the customs app's existing agents.
 */
export async function loadPolicyForAgent(
  ctx: AccountContext,
  agentName: string
): Promise<AutonomyPolicyConfig> {
  const row = await db.agentPolicyConfig
    ?.findUnique({
      where: {
        accountId_agentName: { accountId: ctx.accountId, agentName },
      },
    })
    .catch(() => null);

  if (!row) {
    return { ...DEFAULT_AUTONOMY_POLICY };
  }

  return {
    maxFinancialCommitment:
      row.financialThreshold != null
        ? Number(row.financialThreshold)
        : DEFAULT_AUTONOMY_POLICY.maxFinancialCommitment,
    minAutoConfidence: row.autoThreshold ?? DEFAULT_AUTONOMY_POLICY.minAutoConfidence,
    allowedAutoActions: DEFAULT_AUTONOMY_POLICY.allowedAutoActions,
    forbiddenAutoActions: DEFAULT_AUTONOMY_POLICY.forbiddenAutoActions,
    autonomyMode: (row.autonomyMode as AutonomyPolicyConfig["autonomyMode"]) ?? "BALANCED",
    financialThreshold:
      row.financialThreshold != null ? Number(row.financialThreshold) : null,
    marginThreshold: row.marginThreshold != null ? Number(row.marginThreshold) : null,
    carrierApprovalRequired: row.carrierApprovalRequired ?? false,
    requireInsurance: row.requireInsurance ?? true,
    requireCustomsRelease: row.requireCustomsRelease ?? true,
    requireHumanApproval: row.requireHumanApproval ?? false,
  };
}

export interface EvaluatePolicyActionInput {
  actionType: string;
  financialAmount?: number;
  confidenceScore: number;
  /** Pass to override DB lookup — used in tests */
  policyOverride?: Partial<AutonomyPolicyConfig>;
}

export interface PolicyEvaluation {
  allowed: boolean;
  reason: string;
  triageState: "AUTO_VERIFIED" | "NEEDS_HUMAN_REVIEW";
  gate?: string;
}

export function evaluatePolicyConfig(
  policy: AutonomyPolicyConfig,
  input: EvaluatePolicyActionInput
): PolicyEvaluation {
  const actionType = input.actionType.toUpperCase();
  const financialAmount = input.financialAmount ?? 0;
  const confidence = input.confidenceScore;

  // Gate 0: SUPERVISED mode — never auto-execute
  if (policy.autonomyMode === "SUPERVISED") {
    return {
      allowed: false,
      reason: "Account is in SUPERVISED autonomy mode — all actions require human review.",
      triageState: "NEEDS_HUMAN_REVIEW",
      gate: "AUTONOMY_MODE_SUPERVISED",
    };
  }

  // Gate 1: Explicitly forbidden actions
  if (policy.forbiddenAutoActions.includes(actionType)) {
    return {
      allowed: false,
      reason: `Action '${actionType}' is explicitly forbidden from autonomous execution by tenant policy.`,
      triageState: "NEEDS_HUMAN_REVIEW",
      gate: "FORBIDDEN_ACTION",
    };
  }

  // Gate 2: Human approval required override
  if (policy.requireHumanApproval) {
    return {
      allowed: false,
      reason: "Agent policy requires human approval for all actions on this account.",
      triageState: "NEEDS_HUMAN_REVIEW",
      gate: "REQUIRE_HUMAN_APPROVAL",
    };
  }

  // Gate 3: Financial threshold
  const threshold = policy.financialThreshold ?? policy.maxFinancialCommitment;
  if (financialAmount > threshold) {
    return {
      allowed: false,
      reason: `Financial amount $${financialAmount.toFixed(2)} exceeds autonomy threshold of $${threshold.toFixed(2)}.`,
      triageState: "NEEDS_HUMAN_REVIEW",
      gate: "FINANCIAL_THRESHOLD",
    };
  }

  // Gate 4: AI confidence score
  if (confidence < policy.minAutoConfidence) {
    return {
      allowed: false,
      reason: `AI confidence ${confidence}% is below the minimum required ${policy.minAutoConfidence}%.`,
      triageState: "NEEDS_HUMAN_REVIEW",
      gate: "CONFIDENCE_THRESHOLD",
    };
  }

  // Gate 5: Allowed actions list (skip in AUTONOMOUS mode)
  if (
    policy.autonomyMode !== "AUTONOMOUS" &&
    !policy.allowedAutoActions.includes(actionType)
  ) {
    return {
      allowed: false,
      reason: `Action '${actionType}' is not in the allowed auto-execution list for this account.`,
      triageState: "NEEDS_HUMAN_REVIEW",
      gate: "NOT_IN_ALLOWED_LIST",
    };
  }

  // Passed all policy gates → AUTO_VERIFIED
  return {
    allowed: true,
    reason: `Action '${actionType}' passed all autonomy policy gates (confidence ${confidence}%, amount $${financialAmount.toFixed(2)} <= $${threshold.toFixed(2)}).`,
    triageState: "AUTO_VERIFIED",
    gate: "ALL_GATES_PASSED",
  };
}

export function evaluateAutonomyPolicy(
  ctx: AccountContext,
  input: EvaluatePolicyActionInput,
  agentName = "DEFAULT"
): Promise<PolicyEvaluation> & PolicyEvaluation {
  const syncPolicy = input.policyOverride
    ? { ...DEFAULT_AUTONOMY_POLICY, ...input.policyOverride }
    : DEFAULT_AUTONOMY_POLICY;

  const syncResult = evaluatePolicyConfig(syncPolicy, input);

  const promise = (async () => {
    const loadedPolicy = input.policyOverride
      ? { ...DEFAULT_AUTONOMY_POLICY, ...input.policyOverride }
      : await loadPolicyForAgent(ctx, agentName);
    return evaluatePolicyConfig(loadedPolicy, input);
  })();

  return Object.assign(promise, syncResult);
}
