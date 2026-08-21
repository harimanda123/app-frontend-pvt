import { NextResponse } from "next/server";
import { withCronRoute } from "@/lib/api/auth-guards";
import { db } from "@/lib/db";
import { UflpaEntityListIngestionService } from "@/modules/screening/uflpaEntityListIngestionService";

export const maxDuration = 60;

const DATASET_ID = "uflpa-entity-list";
const DATASET_NAME = "DHS UFLPA Entity List";

async function handleIngest(requestId: string) {
  const alreadyRunning = await db.datasetRefreshLog.findFirst({
    where: { datasetId: DATASET_ID, status: "RUNNING" },
  });
  if (alreadyRunning) {
    return NextResponse.json(
      {
        status: "ALREADY_RUNNING",
        requestId,
        note: `UFLPA Entity List ingestion already has a run in progress (started ${alreadyRunning.startedAt.toISOString()}).`,
      },
      { status: 409 }
    );
  }

  const log = await db.datasetRefreshLog.create({
    data: { datasetId: DATASET_ID, datasetName: DATASET_NAME, triggeredBy: "CRON", status: "RUNNING" },
  });

  try {
    const result = await UflpaEntityListIngestionService.fetchAndIngest();
    await db.datasetRefreshLog.update({
      where: { id: log.id },
      data: {
        status: "SUCCESS",
        summary: `Parsed ${result.parsedCount} entries, ${result.supersededCount} superseded.`,
        itemsIngested: result.parsedCount,
        completedAt: new Date(),
      },
    });
    return NextResponse.json({
      status: "SUCCESS",
      requestId,
      parsedCount: result.parsedCount,
      supersededCount: result.supersededCount,
    });
  } catch (err: any) {
    const errorMessage = err.message || "UFLPA Entity List ingestion failed";
    await db.datasetRefreshLog.update({
      where: { id: log.id },
      data: { status: "FAILED", errorMessage, completedAt: new Date() },
    });
    console.error("[uflpa-entity-list-ingest] Execution failed:", err);
    return NextResponse.json({ status: "FAILED", requestId, error: errorMessage }, { status: 502 });
  }
}

export const GET = withCronRoute(async ({ requestId }) => handleIngest(requestId));

export const POST = withCronRoute(async ({ requestId }) => handleIngest(requestId));
