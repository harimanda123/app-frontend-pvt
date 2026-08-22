import { NextResponse } from "next/server";
import { withAuthenticatedRoute } from "@/lib/api/auth-guards";
import { buildErrorResponse } from "@/lib/api/error";
import { db } from "@/lib/db";

/**
 * GET /api/filing-config/releases
 * Returns releases from FilingCountryCustomsVersion with display format: "Country - Procedure - Release"
 */
export const GET = withAuthenticatedRoute(async ({ ctx, requestId }) => {
  if (!ctx.isPlatformAdmin) {
    return buildErrorResponse(403, "FORBIDDEN", "Filing configuration is available to Platform Admins only.", undefined, requestId);
  }

  const releases = await db.filingCountryCustomsVersion.findMany({
    where: { isActive: true },
    select: { 
      country: true,
      procedureCode: true,
      release: true 
    },
    orderBy: [
      { country: "asc" },
      { procedureCode: "asc" },
      { release: "asc" }
    ],
  });

  // Create codes array and optionLabels object
  const codes = releases.map(r => r.release);
  const optionLabels: Record<string, string> = {};
  releases.forEach(r => {
    optionLabels[r.release] = `${r.country} - ${r.procedureCode} - ${r.release}`;
  });

  return NextResponse.json({ 
    codes: codes,
    optionLabels: optionLabels,
    requestId 
  });
});
