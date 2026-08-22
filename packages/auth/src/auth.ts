import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { db } from "@qubere/db";

export interface AccountContext {
  userId: string;
  clerkUserId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isPlatformAdmin: boolean;
  isSuperAdminReadWrite?: boolean;
  isSuperAdminRead?: boolean;
  isSuperAdminSettings?: boolean;
  platformRoles: string[];
  accountId: string;
  accountName: string;
  accountSlug: string;
  accountType: "ENTERPRISE" | "INDIVIDUAL" | string;
  dataMode: string;
  ownerUserId?: string | null;
  membershipId: string;
  roleIds: string[];
  roleNames: string[];
  permissions: string[];
  memberships: Array<{
    accountId: string;
    accountName: string;
    accountSlug: string;
    accountType: string;
    dataMode: string;
    roleNames: string[];
  }>;
  account: {
    id: string;
    name: string;
    slug: string;
    type: string;
    status: string;
    ownerUserId?: string | null;
    createdAt: Date;
  };
}

export const ACTIVE_ACCOUNT_COOKIE = "qubere_active_account_id";

async function loadAccountContext(): Promise<AccountContext | null> {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return null;
    }

    let dbUser = await db.user.findFirst({
      where: {
        clerkUserId,
        deletedAt: null,
      },
      include: {
        platformRoles: {
          include: { platformRole: true },
        },
        memberships: {
          where: { deletedAt: null },
          include: {
            account: true,
            roles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: { permission: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      const user = await currentUser();
      if (!user) return null;

      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) return null;

      dbUser = await db.user.findFirst({
        where: { email, deletedAt: null },
        include: {
          platformRoles: { include: { platformRole: true } },
          memberships: {
            where: { deletedAt: null },
            include: {
              account: true,
              roles: {
                include: {
                  role: {
                    include: {
                      rolePermissions: { include: { permission: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (dbUser) {
        dbUser = await db.user.update({
          where: { id: dbUser.id },
          data: { clerkUserId },
          include: {
            platformRoles: { include: { platformRole: true } },
            memberships: {
              where: { deletedAt: null },
              include: {
                account: true,
                roles: {
                  include: {
                    role: {
                      include: {
                        rolePermissions: { include: { permission: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
    }

    if (!dbUser || dbUser.memberships.length === 0) {
      return null;
    }

    const activeMembership = dbUser.memberships[0];
    if (!activeMembership) return null;

    const permissions = Array.from(
      new Set(
        activeMembership.roles.flatMap((mr) => mr.role.rolePermissions.map((rp) => rp.permission.name))
      )
    );
    const roleIds = activeMembership.roles.map((mr) => mr.roleId);
    const roleNames = activeMembership.roles.map((mr) => mr.role.name);

    const platformRoleNames = dbUser.platformRoles.map((pr) => pr.platformRole.name);
    const isSuperAdminReadWrite = platformRoleNames.includes("SUPER_ADMIN_READWRITE") || platformRoleNames.includes("PLATFORM_ADMIN");
    const isSuperAdminRead = platformRoleNames.includes("SUPER_ADMIN_READ");
    const isSuperAdminSettings = platformRoleNames.includes("SUPER_ADMIN_SETTINGS") || platformRoleNames.includes("SUPER_ADMIN");
    const isPlatformAdmin = isSuperAdminReadWrite || isSuperAdminRead || isSuperAdminSettings;

    const allMemberships = dbUser.memberships
      .filter((m) => m.status === "ACTIVE" && m.account.deletedAt === null)
      .map((m) => ({
        accountId: m.account.id,
        accountName: m.account.name,
        accountSlug: m.account.slug,
        accountType: m.account.type,
        dataMode: m.account.dataMode as string,
        roleNames: m.roles.map((mr) => mr.role.name),
      }));

    return {
      userId: dbUser.id,
      clerkUserId: dbUser.clerkUserId,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      isPlatformAdmin,
      isSuperAdminReadWrite,
      isSuperAdminRead,
      isSuperAdminSettings,
      platformRoles: platformRoleNames,
      accountId: activeMembership.account.id,
      accountName: activeMembership.account.name,
      accountSlug: activeMembership.account.slug,
      accountType: activeMembership.account.type,
      dataMode: activeMembership.account.dataMode,
      ownerUserId: activeMembership.account.ownerUserId,
      membershipId: activeMembership.id,
      roleIds,
      roleNames,
      permissions,
      memberships: allMemberships,
      account: activeMembership.account,
    };
  } catch (error: unknown) {
    if (
      (error instanceof Error && error.message.includes("DYNAMIC_SERVER_USAGE")) ||
      (typeof error === "object" && error !== null && "digest" in error && (error as Record<string, unknown>).digest === "DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }
    console.error("Error retrieving account context:", error);
    return null;
  }
}

export const getAccountContext = cache(loadAccountContext);

export async function hasPermission(requiredPermission: string): Promise<boolean> {
  const context = await getAccountContext();
  if (!context) return false;
  if (context.isPlatformAdmin) return true;
  if (context.roleNames.includes("OWNER")) return true;
  return context.permissions.includes(requiredPermission);
}
