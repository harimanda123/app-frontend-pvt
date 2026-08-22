import { clerkMiddleware } from "@clerk/nextjs/server";

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_Y29udGVudC1ibHVlZ2lsbC02OC5jbGVyay5hY2NvdW50cy5kZXYk";
}
if (!process.env.CLERK_SECRET_KEY) {
  process.env.CLERK_SECRET_KEY = "sk_test_if3HmwoOtfftlho92gPL1p6wp7JVMRIWVjpNaDc3DS";
}

export default clerkMiddleware(async () => {});

export const config = {
  matcher: [
    // Skip Next.js internals, Clerk proxy paths (/__clerk), and static files
    "/((?!_next|__clerk|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
