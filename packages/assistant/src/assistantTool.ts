import { z } from "zod";
import type { AccountContext } from "@qubere/auth";

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export type CopilotToolAccess =
  | "ALL"
  | "ADMIN_ONLY"
  | { permission?: string; write?: boolean };

export interface AssistantTool {
  declaration: FunctionDeclaration;
  schema: z.ZodObject<any>;
  access?: CopilotToolAccess;
  execute: (ctx: AccountContext, args: Record<string, unknown>) => Promise<unknown>;
}

export class AssistantToolRegistry {
  private tools = new Map<string, AssistantTool>();

  register(tool: AssistantTool): void {
    this.tools.set(tool.declaration.name, tool);
  }

  get(name: string): AssistantTool | undefined {
    return this.tools.get(name);
  }

  list(): AssistantTool[] {
    return Array.from(this.tools.values());
  }

  async execute(
    name: string,
    ctx: AccountContext,
    args: Record<string, unknown>
  ): Promise<unknown> {
    const tool = this.get(name);
    if (!tool) {
      throw new Error(`Assistant tool '${name}' not found in registry.`);
    }
    return tool.execute(ctx, args);
  }
}
