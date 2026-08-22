import { tmsInngest } from "../client";
import { candidateFromDomainEvent } from "../../../modules/memory/memory.domain-events";
import { TmsMemoryExtractor } from "../../../modules/memory/memory.extractor";
import type { TmsMemoryDomainEvent } from "../../../modules/memory/memory.types";

export const TMS_MEMORY_EVENT = "tms/memory.domain-event";

export async function queueTmsMemoryEvent(event: TmsMemoryDomainEvent): Promise<void> {
  await tmsInngest.send({ name: TMS_MEMORY_EVENT, data: event });
}

export const tmsMemoryExtractionJob = (tmsInngest.createFunction as any)(
  { id: "tms-account-memory-extraction", retries: 4, triggers: [{ event: TMS_MEMORY_EVENT }] },
  async ({ event, step }: { event: { data: TmsMemoryDomainEvent }; step: any }) => {
    const candidate = await step.run("build-memory-candidate", () => candidateFromDomainEvent(event.data));
    if (!candidate) return { stored: false, reason: "event-not-durable" };
    const memory = await step.run("store-account-memory", () => TmsMemoryExtractor.process(candidate));
    return { stored: Boolean(memory), memoryId: memory?.id ?? null };
  }
);
