import React from "react";
import { Card, Button } from "@/components/ui";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-8">
      <Card className="p-8 text-center max-w-md space-y-4 shadow-lg border-danger-subtle">
        <ShieldAlert className="w-12 h-12 text-danger mx-auto" />
        <h2 className="text-xl font-extrabold text-ink">Access Denied</h2>
        <p className="text-xs text-ink-muted font-medium">
          {message ?? "You do not have permission to access Qubere TMS Freight Execution System (tms.access required)."}
        </p>
        <div className="pt-2">
          <Link href="/sign-in">
            <Button variant="primary" size="sm">
              Return to Sign In
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
