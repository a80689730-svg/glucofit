import { apiGetMyHealthEntries, useBackendActor } from "@/api";
import type { GlucoseEntry, WeightEntry } from "@/backend";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Droplets,
  Plus,
  Scale,
  TrendingUp,
  Zap,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────────── */

function getGlucoseStatus(value: number): {
  label: string;
  variant: "secondary" | "destructive" | "outline";
} {
  if (value < 70) return { label: "LOW", variant: "outline" };
  if (value > 140) return { label: "HIGH", variant: "destructive" };
  return { label: "NORMAL", variant: "secondary" };
}

function formatTime(ts: bigint) {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isThisWeek(ts: bigint): boolean {
  const d = new Date(Number(ts));
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}

/* ─── skeleton ────────────────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="space-y-8" data-ocid="dashboard.loading_state">
      {/* greeting */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      {/* stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* quick actions + recent */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── empty state ─────────────────────────────────────────────────── */

function EmptyRecentEntries({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-10 text-center"
      data-ocid="dashboard.recent-entries.empty_state"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Activity className="h-7 w-7 text-primary" />
      </div>
      <div>
        <p className="font-display text-base font-semibold text-foreground">
          No health entries yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start tracking your glucose and weight to see your history here.
        </p>
      </div>
      <Button
        size="sm"
        onClick={onAdd}
        data-ocid="dashboard.recent-entries.add_button"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Entry
      </Button>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────────────── */

export function DashboardPage() {
  const { currentUser, sessionToken, isAuthenticated, isAdmin } =
    useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const navigate = useNavigate();

  const { data: healthPage, isLoading } = useQuery({
    queryKey: ["my-health", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiGetMyHealthEntries(actor, sessionToken, BigInt(0), BigInt(50));
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });

  // Auth guards
  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  if (isAdmin) {
    navigate({ to: "/admin/dashboard" });
    return null;
  }

  /* derived data */
  const glucoseEntries: GlucoseEntry[] = [
    ...(healthPage?.glucoseEntries ?? []),
  ].sort((a, b) => Number(b.readingTime) - Number(a.readingTime));

  const weightEntries: WeightEntry[] = [
    ...(healthPage?.weightEntries ?? []),
  ].sort((a, b) => Number(b.recordedAt) - Number(a.recordedAt));

  const latestGlucose = glucoseEntries[0];

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const todayGlucose = glucoseEntries.find(
    (e) => Number(e.readingTime) >= todayStart,
  );
  const todayWeight = weightEntries.find(
    (e) => Number(e.recordedAt) >= todayStart,
  );

  const weeklyReadings =
    glucoseEntries.filter((e) => isThisWeek(e.readingTime)).length +
    weightEntries.filter((e) => isThisWeek(e.recordedAt)).length;

  const weekGlucose = glucoseEntries.filter((e) => isThisWeek(e.readingTime));
  const avgGlucose =
    weekGlucose.length > 0
      ? Math.round(
          weekGlucose.reduce((sum, e) => sum + e.value, 0) / weekGlucose.length,
        )
      : null;

  // Combined recent entries
  type EntryItem =
    | { kind: "glucose"; entry: GlucoseEntry; sortTs: number }
    | { kind: "weight"; entry: WeightEntry; sortTs: number };

  const recentEntries: EntryItem[] = [
    ...glucoseEntries.map((e) => ({
      kind: "glucose" as const,
      entry: e,
      sortTs: Number(e.readingTime),
    })),
    ...weightEntries.map((e) => ({
      kind: "weight" as const,
      entry: e,
      sortTs: Number(e.recordedAt),
    })),
  ]
    .sort((a, b) => b.sortTs - a.sortTs)
    .slice(0, 5);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";
  const firstName = currentUser?.fullName?.split(" ")[0] ?? "there";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="user" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {isLoading ? (
              <DashboardSkeleton />
            ) : (
              <div className="space-y-8" data-ocid="dashboard.page">
                {/* ── Greeting ── */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                      {greeting}, {firstName}!
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {now.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Link to="/add-data">
                    <Button data-ocid="dashboard.add_data.primary_button">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Data
                    </Button>
                  </Link>
                </div>

                {/* ── 4 Stat Cards ── */}
                <div
                  className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
                  data-ocid="dashboard.stats.section"
                >
                  {/* Today's Glucose */}
                  <Card
                    className="border-l-4 border-l-primary"
                    data-ocid="dashboard.today-glucose.card"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Today's Glucose
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Droplets className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {todayGlucose ? (
                        <>
                          <div className="flex items-end gap-1">
                            <span className="font-display text-3xl font-bold text-primary">
                              {todayGlucose.value}
                            </span>
                            <span className="mb-0.5 text-sm font-medium text-muted-foreground">
                              {todayGlucose.unit}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge
                              variant={
                                getGlucoseStatus(todayGlucose.value).variant
                              }
                              className="text-xs"
                            >
                              {getGlucoseStatus(todayGlucose.value).label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(todayGlucose.readingTime)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="pt-1">
                          <p className="font-display text-xl font-semibold text-muted-foreground">
                            No readings today
                          </p>
                          <Link
                            to="/add-data"
                            search={
                              { tab: "glucose" } as Record<string, string>
                            }
                          >
                            <p className="mt-1 text-xs font-medium text-primary hover:underline">
                              Add one now →
                            </p>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Today's Weight */}
                  <Card
                    className="border-l-4 border-l-secondary"
                    data-ocid="dashboard.today-weight.card"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Today's Weight
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                          <Scale className="h-4 w-4 text-secondary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {todayWeight ? (
                        <>
                          <div className="flex items-end gap-1">
                            <span className="font-display text-3xl font-bold text-secondary">
                              {todayWeight.value}
                            </span>
                            <span className="mb-0.5 text-sm font-medium text-muted-foreground">
                              {todayWeight.unit}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Recorded at {formatTime(todayWeight.recordedAt)}
                          </p>
                        </>
                      ) : (
                        <div className="pt-1">
                          <p className="font-display text-xl font-semibold text-muted-foreground">
                            Not recorded
                          </p>
                          <Link
                            to="/add-data"
                            search={{ tab: "weight" } as Record<string, string>}
                          >
                            <p className="mt-1 text-xs font-medium text-secondary hover:underline">
                              Log weight →
                            </p>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Weekly Readings */}
                  <Card data-ocid="dashboard.weekly-readings.card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Weekly Readings
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-1">
                        <span className="font-display text-3xl font-bold text-foreground">
                          {weeklyReadings}
                        </span>
                        <span className="mb-0.5 text-sm text-muted-foreground">
                          entries
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {weekGlucose.length} glucose &amp;{" "}
                        {weeklyReadings - weekGlucose.length} weight this week
                      </p>
                    </CardContent>
                  </Card>

                  {/* Avg Glucose */}
                  <Card data-ocid="dashboard.avg-glucose.card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Average Glucose
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {avgGlucose !== null ? (
                        <>
                          <div className="flex items-end gap-1">
                            <span className="font-display text-3xl font-bold text-primary">
                              {avgGlucose}
                            </span>
                            <span className="mb-0.5 text-sm text-muted-foreground">
                              {latestGlucose?.unit ?? "mg/dL"}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge
                              variant={getGlucoseStatus(avgGlucose).variant}
                              className="text-xs"
                            >
                              {getGlucoseStatus(avgGlucose).label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              7-day avg
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="pt-1">
                          <p className="font-display text-xl font-semibold text-muted-foreground">
                            N/A
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            No glucose this week
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* ── Quick Actions + Recent Entries ── */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Quick Actions */}
                  <Card data-ocid="dashboard.quick-actions.card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4 text-primary" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link
                        to="/add-data"
                        search={{ tab: "glucose" } as Record<string, string>}
                        className="block"
                      >
                        <Button
                          className="w-full justify-start gap-3"
                          data-ocid="dashboard.add-blood-sugar.button"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-foreground/20">
                            <Droplets className="h-3.5 w-3.5" />
                          </div>
                          Add Blood Sugar
                        </Button>
                      </Link>
                      <Link
                        to="/add-data"
                        search={{ tab: "weight" } as Record<string, string>}
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3 border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary"
                          data-ocid="dashboard.add-weight.button"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary/10">
                            <Scale className="h-3.5 w-3.5" />
                          </div>
                          Add Weight
                        </Button>
                      </Link>
                      <div className="pt-2 border-t border-border">
                        <Link to="/reports" className="block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                            data-ocid="dashboard.view-reports.button"
                          >
                            <BarChart3 className="h-4 w-4" />
                            View Reports
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Entries */}
                  <Card
                    className="lg:col-span-2"
                    data-ocid="dashboard.recent-entries.card"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Activity className="h-4 w-4 text-primary" />
                          Recent Entries
                        </CardTitle>
                        <Link to="/reports">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-foreground"
                            data-ocid="dashboard.all-entries.link"
                          >
                            View all
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {recentEntries.length === 0 ? (
                        <EmptyRecentEntries
                          onAdd={() => navigate({ to: "/add-data" })}
                        />
                      ) : (
                        <div className="divide-y divide-border">
                          {recentEntries.map((item, i) => {
                            if (item.kind === "glucose") {
                              const e = item.entry;
                              const status = getGlucoseStatus(e.value);
                              return (
                                <div
                                  key={`g-${String(e.id)}`}
                                  className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30"
                                  data-ocid={`dashboard.recent-entries.item.${i + 1}`}
                                >
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Droplets className="h-4.5 w-4.5 text-primary" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                      Blood Sugar
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(e.readingTime)} ·{" "}
                                      {formatTime(e.readingTime)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-display text-lg font-bold text-primary">
                                      {e.value}
                                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                                        {e.unit}
                                      </span>
                                    </span>
                                    <Badge
                                      variant={status.variant}
                                      className="text-xs"
                                    >
                                      {status.label}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            }
                            const e = item.entry;
                            return (
                              <div
                                key={`w-${String(e.id)}`}
                                className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30"
                                data-ocid={`dashboard.recent-entries.item.${i + 1}`}
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                                  <Scale className="h-4 w-4 text-secondary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground">
                                    Weight
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(e.recordedAt)} ·{" "}
                                    {formatTime(e.recordedAt)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="font-display text-lg font-bold text-secondary">
                                    {e.value}
                                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                                      {e.unit}
                                    </span>
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    LOGGED
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
