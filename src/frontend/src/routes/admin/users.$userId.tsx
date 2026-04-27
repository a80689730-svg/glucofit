import { apiAdminGetUserDetail, useBackendActor } from "@/api";
import type { GlucoseEntry, WeightEntry } from "@/backend";
import { AdminHeader } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, ArrowLeft, Scale } from "lucide-react";

function GlucoseTable({ entries }: { entries: GlucoseEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No glucose readings"
        description="This user hasn't logged any glucose readings yet."
        className="py-10"
        data-ocid="admin.user-detail.glucose.empty_state"
      />
    );
  }

  return (
    <div
      className="overflow-x-auto"
      data-ocid="admin.user-detail.glucose.table"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date & Time
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Value
            </th>
            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((e, i) => {
            const isLow = e.value < 70;
            const isHigh = e.value > 140;
            const label = isLow ? "LOW" : isHigh ? "HIGH" : "NORMAL";
            const badgeVariant: "destructive" | "outline" | "secondary" = isHigh
              ? "destructive"
              : isLow
                ? "outline"
                : "secondary";

            return (
              <tr
                key={String(e.id)}
                className="hover:bg-muted/30 transition-colors"
                data-ocid={`admin.user-detail.glucose.item.${i + 1}`}
              >
                <td className="px-5 py-3 text-foreground">
                  {new Date(Number(e.readingTime)).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-foreground">
                  {e.value}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {e.unit}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <Badge variant={badgeVariant} className="text-xs">
                    {label}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs hidden sm:table-cell max-w-xs truncate">
                  {e.notes || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WeightTable({ entries }: { entries: WeightEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="No weight entries"
        description="This user hasn't logged any weight entries yet."
        className="py-10"
        data-ocid="admin.user-detail.weight.empty_state"
      />
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="admin.user-detail.weight.table">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date & Time
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Weight
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((e, i) => (
            <tr
              key={String(e.id)}
              className="hover:bg-muted/30 transition-colors"
              data-ocid={`admin.user-detail.weight.item.${i + 1}`}
            >
              <td className="px-5 py-3 text-foreground">
                {new Date(Number(e.recordedAt)).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-foreground">
                {e.value}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {e.unit}
                </span>
              </td>
              <td className="px-5 py-3 text-muted-foreground text-xs hidden sm:table-cell max-w-xs truncate">
                {e.notes || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminUserDetailPage() {
  const routerState = useRouterState();
  const pathParts = routerState.location.pathname.split("/");
  const userId = pathParts[pathParts.length - 1] ?? "";

  const { isAuthenticated, isAdmin, sessionToken } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const navigate = useNavigate();

  const { data: userDetail, isLoading } = useQuery({
    queryKey: ["admin-user-detail", userId, sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiAdminGetUserDetail(actor, sessionToken, userId);
    },
    enabled: !!actor && !isFetching && !!sessionToken && !!userId,
  });

  if (!isAuthenticated) {
    navigate({ to: "/admin/login" });
    return null;
  }
  if (!isAdmin) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const shellLayout = (content: React.ReactNode) => (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="admin" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-5xl px-6 py-8">{content}</div>
        </main>
      </div>
    </div>
  );

  if (isLoading) {
    return shellLayout(<PageLoader />);
  }

  if (!userDetail) {
    return shellLayout(
      <EmptyState
        title="User not found"
        description="This user does not exist or has been removed."
        action={{
          label: "Back to Users",
          onClick: () => navigate({ to: "/admin/users" }),
        }}
        data-ocid="admin.user-detail.not-found.empty_state"
      />,
    );
  }

  const glucoseEntries = [...(userDetail.glucoseEntries ?? [])].sort(
    (a, b) => Number(b.readingTime) - Number(a.readingTime),
  );
  const weightEntries = [...(userDetail.weightEntries ?? [])].sort(
    (a, b) => Number(b.recordedAt) - Number(a.recordedAt),
  );

  const initials = userDetail.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = new Date(Number(userDetail.createdAt)).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return shellLayout(
    <div className="space-y-6" data-ocid="admin.user-detail.page">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link to="/admin/users">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            data-ocid="admin.user-detail.back.button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      {/* User profile header */}
      <Card data-ocid="admin.user-detail.profile.card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold font-display shadow-md">
              {initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-xl font-bold text-foreground">
                {userDetail.fullName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {userDetail.email}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Member since {joinDate}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="default" className="gap-1">
                  <Activity className="h-3 w-3" />
                  {glucoseEntries.length} glucose readings
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Scale className="h-3 w-3" />
                  {weightEntries.length} weight entries
                </Badge>
                <Badge variant="outline">
                  {glucoseEntries.length + weightEntries.length} total entries
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health data tabs */}
      <Card data-ocid="admin.user-detail.health-data.card">
        <CardHeader>
          <CardTitle>Health Data</CardTitle>
          <p className="text-sm text-muted-foreground">
            All records, newest first
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="glucose" data-ocid="admin.user-detail.health.tab">
            <div className="border-b border-border px-5">
              <TabsList className="h-10 bg-transparent p-0 gap-4">
                <TabsTrigger
                  value="glucose"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent h-10 px-0 text-sm font-medium"
                  data-ocid="admin.user-detail.glucose.tab"
                >
                  <Activity className="mr-1.5 h-3.5 w-3.5" />
                  Glucose Readings
                  <Badge variant="outline" className="ml-2 text-xs">
                    {glucoseEntries.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="weight"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:text-secondary bg-transparent h-10 px-0 text-sm font-medium"
                  data-ocid="admin.user-detail.weight.tab"
                >
                  <Scale className="mr-1.5 h-3.5 w-3.5" />
                  Weight Entries
                  <Badge variant="outline" className="ml-2 text-xs">
                    {weightEntries.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="glucose"
              className="mt-0"
              data-ocid="admin.user-detail.glucose.panel"
            >
              <GlucoseTable entries={glucoseEntries} />
            </TabsContent>
            <TabsContent
              value="weight"
              className="mt-0"
              data-ocid="admin.user-detail.weight.panel"
            >
              <WeightTable entries={weightEntries} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>,
  );
}

export default AdminUserDetailPage;
