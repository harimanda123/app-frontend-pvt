import { clerkMiddleware } from "@clerk/nextjs/server";

// This skeleton only has a single Clerk-gated home page, which performs its
// own auth() check and redirect (see src/app/page.tsx) -- mirroring
// apps/custom's landing page pattern rather than blanket-protecting routes
// here. The proxy still needs to run so Clerk can attach auth context.
export default clerkMiddleware(async () => {});

export const config = {
  matcher: [
    // Skip Next.js internals, Clerk proxy paths (/__clerk), and static files
    "/((?!_next|__clerk|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
