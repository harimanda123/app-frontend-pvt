import { serve } from "inngest/next";
import { tmsInngest } from "@/lib/inngest/client";
import { tmsMemoryExtractionJob } from "@/lib/inngest/functions/tmsMemoryExtraction";

export const { GET, POST, PUT } = serve({
  client: tmsInngest,
  functions: [tmsMemoryExtractionJob],
});
