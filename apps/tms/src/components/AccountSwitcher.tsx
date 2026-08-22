"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

interface AccountSwitcherProps {
  currentAccountId?: string;
  currentAccountName?: string;
  currentAccountType?: string;
  currentDataMode?: string;
  currentRoleNames?: string[];
  memberships?: Array<{
    accountId: string;
    accountName: string;
    accountType: string;
    dataMode?: string;
    roleNames: string[];
  }>;
}

export function AccountSwitcher({
  currentAccountId = "",
  currentAccountName = "Workspace Account",
  currentAccountType = "ENTERPRISE",
  currentDataMode = "PRODUCTION",
  currentRoleNames = ["MEMBER"],
  memberships = [],
}: AccountSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const availableMemberships = memberships;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 bg-white border border-border rounded-2xl flex items-center justify-between hover:border-brand/50 shadow-2xs transition-all text-left cursor-pointer"
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div
            className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
              currentAccountType === "ENTERPRISE"
                ? "bg-blue-50 text-brand border border-blue-100"
                : "bg-purple-50 text-purple-600 border border-purple-100"
            }`}
          >
            {currentAccountName.slice(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-ink truncate">{currentAccountName}</p>
            <div className="flex items-center space-x-1.5 mt-0.5 flex-wrap gap-y-0.5">
              <span className="text-[10px] text-ink-muted font-mono uppercase">{currentAccountType}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-50 text-brand font-semibold border border-blue-100">
                {currentRoleNames.join(", ")}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-ink-muted shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-border rounded-2xl shadow-xl z-50 p-2 space-y-1">
          <p className="px-2 py-1 text-[10px] font-bold text-ink-muted uppercase tracking-wider">
            Switch Freight Workspace
          </p>
          {availableMemberships.map((m) => {
            const isCurrent = m.accountId === currentAccountId || m.accountName === currentAccountName;
            return (
              <button
                key={m.accountId}
                onClick={() => {
                  setIsOpen(false);
                  router.refresh();
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                  isCurrent ? "bg-surface-muted font-bold text-brand" : "hover:bg-surface-muted text-ink"
                }`}
              >
                <div className="truncate">
                  <p className="truncate font-semibold">{m.accountName}</p>
                  <p className="text-[10px] text-ink-muted">{m.accountType} • {m.roleNames.join(", ")}</p>
                </div>
                {isCurrent && <Check className="w-4 h-4 text-brand shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
