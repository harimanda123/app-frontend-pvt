import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@qubere/db";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Proof that the shared DB connection works from this new app: a trivial
  // read through the shared @qubere/db client, same package apps/custom uses.
  const accountCount = await db.account.count();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Qubere TMS</h1>
      <p className="text-slate-400">
        Skeleton app -- shared Clerk auth and shared Prisma DB connection, proven end-to-end.
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 flex flex-col items-center gap-1">
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Accounts visible via @qubere/db
        </span>
        <span className="text-2xl font-semibold">{accountCount}</span>
      </div>
    </main>
  );
}
