import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TmsSidebar } from "@/components/TmsSidebar";
import { TmsHeader } from "@/components/TmsHeader";
import { Users, UserPlus, Shield, Mail, CheckCircle2 } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

export default async function AdminUsersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const users = [
    { id: "usr_01", name: "Operations Lead", email: "operations@enterprisefreight.com", role: "OWNER / DISPATCHER", status: "Active", joined: "2025-01-15" },
    { id: "usr_02", name: "Sarah Jenkins", email: "s.jenkins@enterprisefreight.com", role: "DISPATCHER", status: "Active", joined: "2025-03-10" },
    { id: "usr_03", name: "Michael Vance", email: "m.vance@enterprisefreight.com", role: "FINANCE_AUDITOR", status: "Active", joined: "2025-04-01" },
    { id: "usr_04", name: "Dispatch Automation Bot", email: "ai-dispatcher@qubere.ai", role: "SYSTEM_AGENT", status: "Active", joined: "2025-01-01" },
  ];

  return (
    <div className="min-h-screen bg-surface-muted text-ink flex w-full">
      <TmsSidebar accountName="Enterprise Freight" />

      <div className="flex-1 flex flex-col min-w-0">
        <TmsHeader tenantName="Enterprise Freight" userName="Operations Lead" />

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-brand" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">User Management & Permissions</h1>
              </div>
              <p className="text-xs text-ink-muted mt-1">
                Manage team members, dispatchers, finance auditors, and invite new users.
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Invite New User</span>
            </Button>
          </div>

          {/* User Table Card */}
          <Card className="bg-white border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted border-b border-border font-bold text-ink uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-ink text-xs">{u.name}</p>
                          <p className="text-[11px] text-ink-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-brand">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-ink-muted font-medium">{u.joined}</td>
                    <td className="p-4 text-right">
                      <button className="text-xs font-semibold text-brand hover:underline">
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </main>
      </div>
    </div>
  );
}
