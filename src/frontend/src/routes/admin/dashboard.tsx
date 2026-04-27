import {
  apiAdminListUsers,
  apiGetAllHealthEntries,
  apiGetUnreadNotifications,
  apiMarkNotificationsRead,
  useBackendActor,
} from "@/api";
import type { Notification } from "@/backend";
import { AdminHeader } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  ocid,
  loading,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  ocid: string;
  loading?: boolean;
}) {
  return (
    <Card data-ocid={ocid} className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p
                className={`font-display text-3xl font-bold ${colorClass} mt-1`}
              >
                {value}
              </p>
            )}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgClass}`}
          >
            <Icon className={`h-6 w-6 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationItem({
  notification,
  index,
  onMarkRead,
  isPending,
}: {
  notification: Notification;
  index: number;
  onMarkRead: (id: bigint) => void;
  isPending: boolean;
}) {
  const isGlucose = notification.kind === "glucose";
  const timeAgo = formatDistanceToNow(
    new Date(Number(notification.timestamp) / 1_000_000),
    { addSuffix: true },
  );

  return (
    <div
      className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
      data-ocid={`admin.dashboard.notification.item.${index + 1}`}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isGlucose
            ? "bg-primary/15 text-primary"
            : "bg-secondary/15 text-secondary"
        }`}
      >
        {isGlucose ? "G" : "W"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">
          {notification.userName}
        </p>
        <p className="text-xs text-muted-foreground">
          {isGlucose ? "Glucose" : "Weight"}: {notification.value}{" "}
          {notification.unit}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant={isGlucose ? "default" : "secondary"}
          className="text-xs"
        >
          {isGlucose ? "glucose" : "weight"}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => onMarkRead(notification.id)}
          disabled={isPending}
          aria-label="Mark as read"
          data-ocid={`admin.dashboard.notification.mark-read.${index + 1}`}
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { isAuthenticated, isAdmin, sessionToken, currentUser } =
    useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      return apiAdminListUsers(actor, sessionToken);
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchInterval: 10_000,
  });

  const { data: allHealth, isLoading: healthLoading } = useQuery({
    queryKey: ["admin-all-health", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiGetAllHealthEntries(
        actor,
        sessionToken,
        BigInt(0),
        BigInt(500),
      );
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchInterval: 10_000,
  });

  const { data: notifications, isLoading: notifsLoading } = useQuery({
    queryKey: ["admin-notifications", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      return apiGetUnreadNotifications(actor, sessionToken);
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchInterval: 10_000,
  });

  const { mutate: markRead, isPending: markReadPending } = useMutation({
    mutationFn: async (ids: bigint[]) => {
      if (!actor || !sessionToken) return;
      await apiMarkNotificationsRead(actor, sessionToken, ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success("Notification marked as read");
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  const handleMarkOne = (id: bigint) => markRead([id]);
  const handleMarkAll = () => {
    const ids = (notifications ?? []).map((n) => n.id);
    if (ids.length === 0) return;
    markRead(ids);
  };

  if (!isAuthenticated) {
    navigate({ to: "/admin/login" });
    return null;
  }
  if (!isAdmin) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const isInitialLoading = usersLoading || healthLoading;

  if (isInitialLoading && !users && !allHealth) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden md:flex">
          <Sidebar variant="admin" />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <PageLoader />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const totalUsers = users?.length ?? 0;
  const totalGlucose = allHealth?.glucoseEntries?.length ?? 0;
  const totalWeight = allHealth?.weightEntries?.length ?? 0;
  const totalEntries = totalGlucose + totalWeight;
  const unreadNotifs = notifications?.length ?? 0;
  const adminName = currentUser?.fullName?.split(" ")[0] ?? "Admin";

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      ocid: "admin.dashboard.users.card",
    },
    {
      label: "Total Entries",
      value: totalEntries,
      icon: Activity,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      ocid: "admin.dashboard.entries.card",
    },
    {
      label: "Glucose Readings",
      value: totalGlucose,
      icon: TrendingUp,
      colorClass: "text-secondary",
      bgClass: "bg-secondary/10",
      ocid: "admin.dashboard.glucose.card",
    },
    {
      label: "Unread Notifications",
      value: unreadNotifs,
      icon: Bell,
      colorClass:
        unreadNotifs > 0 ? "text-destructive" : "text-muted-foreground",
      bgClass: unreadNotifs > 0 ? "bg-destructive/10" : "bg-muted",
      ocid: "admin.dashboard.notifs.card",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="admin" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="space-y-8" data-ocid="admin.dashboard.page">
              {/* Page header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Welcome back, {adminName}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Overview of all user activity · refreshes every 10s
                  </p>
                </div>
                {unreadNotifs > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    {unreadNotifs} new
                  </Badge>
                )}
              </div>

              {/* Stats row */}
              <div
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                data-ocid="admin.dashboard.stats.section"
              >
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    {...stat}
                    loading={usersLoading || healthLoading || notifsLoading}
                  />
                ))}
              </div>

              {/* Notifications panel */}
              <Card data-ocid="admin.dashboard.notifications.card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-foreground" />
                      <CardTitle>Unread Notifications</CardTitle>
                      {unreadNotifs > 0 && (
                        <Badge
                          className="bg-destructive text-destructive-foreground text-xs"
                          data-ocid="admin.dashboard.notifs.badge"
                        >
                          {unreadNotifs}
                        </Badge>
                      )}
                    </div>
                    {unreadNotifs > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAll}
                        disabled={markReadPending}
                        className="gap-1.5 text-xs"
                        data-ocid="admin.dashboard.mark-all-read.button"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark All Read
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Real-time data submissions from users
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  {notifsLoading ? (
                    <div
                      className="divide-y divide-border"
                      data-ocid="admin.dashboard.notifications.loading_state"
                    >
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 px-5 py-3.5"
                        >
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : unreadNotifs === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center gap-3 py-12"
                      data-ocid="admin.dashboard.notifications.empty_state"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <BellOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          All caught up!
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          No unread notifications right now
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-border max-h-96 overflow-y-auto">
                      {(notifications as Notification[]).map((n, i) => (
                        <NotificationItem
                          key={String(n.id)}
                          notification={n}
                          index={i}
                          onMarkRead={handleMarkOne}
                          isPending={markReadPending}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent users preview */}
              {(users ?? []).length > 0 && (
                <Card data-ocid="admin.dashboard.recent-users.card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Users</CardTitle>
                      <Badge variant="outline">{totalUsers} total</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {(users ?? []).slice(0, 5).map((user, i) => (
                        <div
                          key={String(user.id)}
                          className="flex items-center justify-between px-6 py-3"
                          data-ocid={`admin.dashboard.user.item.${i + 1}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
                              {user.fullName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {String(user.entryCount)} entries
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
