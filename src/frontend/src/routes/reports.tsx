import { apiGetMyHealthEntries, useBackendActor } from "@/api";
import type { GlucoseEntry, WeightEntry } from "@/backend";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart2,
  Droplets,
  Scale,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDateShort(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDateFull(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(ts: bigint) {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getGlucoseStatus(value: number): {
  label: string;
  inRange: boolean;
} {
  if (value < 70) return { label: "Low", inRange: false };
  if (value > 140) return { label: "High", inRange: false };
  return { label: "Normal", inRange: true };
}

function getDaysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

// ─── skeleton components ───────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="pt-5">
            <Skeleton className="h-9 w-9 rounded-lg mb-3" />
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div style={{ height }} className="flex flex-col gap-3 pt-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${40 + (i % 3) * 30}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-3 w-10" />
        ))}
      </div>
    </div>
  );
}

// ─── time range button ─────────────────────────────────────────────────────────

type TimeRange = 7 | 14 | 30;

interface TimeRangeButtonProps {
  value: TimeRange;
  active: boolean;
  onClick: () => void;
}
function TimeRangeButton({ value, active, onClick }: TimeRangeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`reports.time-range.${value}`}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
      }`}
    >
      {value} days
    </button>
  );
}

// ─── sort icon helper ─────────────────────────────────────────────────────────

type SortDir = "asc" | "desc";
function SortIcon({ dir }: { dir?: SortDir }) {
  if (!dir) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-50" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />
  );
}

// ─── main component ────────────────────────────────────────────────────────────

export function ReportsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, sessionToken } = useAuthStore();
  const { actor, isFetching } = useBackendActor();

  const [timeRange, setTimeRange] = useState<TimeRange>(7);
  const [typeFilter, setTypeFilter] = useState<"all" | "glucose" | "weight">(
    "all",
  );
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // fetch with high limit to get all entries
  const { data: healthPage, isLoading } = useQuery({
    queryKey: ["my-health-reports", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiGetMyHealthEntries(actor, sessionToken, BigInt(0), BigInt(500));
    },
    enabled: !!actor && !isFetching && !!sessionToken,
  });

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  if (isAdmin) {
    navigate({ to: "/admin/dashboard" });
    return null;
  }

  // ── filter by time range ──
  const cutoff = getDaysAgo(timeRange);

  const glucoseAll: GlucoseEntry[] = [
    ...(healthPage?.glucoseEntries ?? []),
  ].sort((a, b) => Number(a.readingTime) - Number(b.readingTime));
  const weightAll: WeightEntry[] = [...(healthPage?.weightEntries ?? [])].sort(
    (a, b) => Number(a.recordedAt) - Number(b.recordedAt),
  );

  const glucoseFiltered = glucoseAll.filter(
    (e) => Number(e.readingTime) >= cutoff,
  );
  const weightFiltered = weightAll.filter(
    (e) => Number(e.recordedAt) >= cutoff,
  );

  // ── stats ──
  const avgGlucose = glucoseFiltered.length
    ? Math.round(
        glucoseFiltered.reduce((s, e) => s + e.value, 0) /
          glucoseFiltered.length,
      )
    : null;
  const minGlucose = glucoseFiltered.length
    ? Math.min(...glucoseFiltered.map((e) => e.value))
    : null;
  const maxGlucose = glucoseFiltered.length
    ? Math.max(...glucoseFiltered.map((e) => e.value))
    : null;
  const latestWeight = weightFiltered.at(-1) ?? weightAll.at(-1);
  const totalEntries = glucoseFiltered.length + weightFiltered.length;

  const avgInRange =
    avgGlucose !== null && avgGlucose >= 70 && avgGlucose <= 140;

  // ── chart data ──
  const glucoseData = glucoseFiltered.map((e) => ({
    date: formatDateShort(e.readingTime),
    glucose: e.value,
  }));
  const weightData = weightFiltered.map((e) => ({
    date: formatDateShort(e.recordedAt),
    weight: e.value,
  }));

  // ── history table ──
  type HistoryRow = {
    ts: bigint;
    type: "Glucose" | "Weight";
    value: number;
    unit: string;
    notes: string;
  };

  const allRows: HistoryRow[] = [
    ...glucoseAll.map(
      (e): HistoryRow => ({
        ts: e.readingTime,
        type: "Glucose",
        value: e.value,
        unit: e.unit,
        notes: e.notes,
      }),
    ),
    ...weightAll.map(
      (e): HistoryRow => ({
        ts: e.recordedAt,
        type: "Weight",
        value: e.value,
        unit: e.unit,
        notes: e.notes,
      }),
    ),
  ];

  const filteredRows = allRows
    .filter((r) => typeFilter === "all" || r.type.toLowerCase() === typeFilter)
    .sort((a, b) =>
      sortDir === "desc"
        ? Number(b.ts) - Number(a.ts)
        : Number(a.ts) - Number(b.ts),
    );

  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="user" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="space-y-7" data-ocid="reports.page">
              {/* ── Page header + time range ── */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Health Reports
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Visual analysis of your glucose and weight trends
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 rounded-full bg-muted p-1"
                  data-ocid="reports.time-range-selector"
                >
                  {([7, 14, 30] as TimeRange[]).map((d) => (
                    <TimeRangeButton
                      key={d}
                      value={d}
                      active={timeRange === d}
                      onClick={() => setTimeRange(d)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Summary stats ── */}
              {isLoading ? (
                <StatsSkeleton />
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {/* Avg Glucose */}
                  <Card data-ocid="reports.stat.item.1">
                    <CardContent className="pt-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                        <Droplets className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-display text-2xl font-bold text-primary">
                        {avgGlucose != null ? `${avgGlucose}` : "—"}
                        {avgGlucose != null && (
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            mg/dL
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          Avg Glucose
                        </p>
                        {avgGlucose != null && (
                          <Badge
                            variant={avgInRange ? "secondary" : "destructive"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {avgInRange ? "In Range" : "Out of Range"}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Glucose Range */}
                  <Card data-ocid="reports.stat.item.2">
                    <CardContent className="pt-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {minGlucose != null && maxGlucose != null
                          ? `${minGlucose}–${maxGlucose}`
                          : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Glucose Range (mg/dL)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Latest Weight */}
                  <Card data-ocid="reports.stat.item.3">
                    <CardContent className="pt-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 mb-3">
                        <Scale className="h-4 w-4 text-secondary" />
                      </div>
                      <p className="font-display text-2xl font-bold text-secondary">
                        {latestWeight != null ? `${latestWeight.value}` : "—"}
                        {latestWeight != null && (
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            {latestWeight.unit}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          Latest Weight
                        </p>
                        {latestWeight && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Stable
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Entries */}
                  <Card data-ocid="reports.stat.item.4">
                    <CardContent className="pt-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted mb-3">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {totalEntries}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total Entries ({timeRange}d)
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── Glucose Line Chart ── */}
              <Card data-ocid="reports.glucose-chart.card">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle>Glucose Trends</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Blood glucose readings over the last {timeRange} days
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1.5" />
                        Low &lt;70
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-1.5" />
                        Normal 70–140
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full bg-destructive mr-1.5" />
                        High &gt;140
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ChartSkeleton height={260} />
                  ) : glucoseData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart
                        data={glucoseData}
                        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                          domain={[40, 260]}
                          width={42}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            fontSize: 12,
                          }}
                          labelStyle={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                          }}
                          formatter={(v: number) => [`${v} mg/dL`, "Glucose"]}
                        />
                        <Legend
                          formatter={() => "Glucose (mg/dL)"}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: 12 }}
                        />
                        <ReferenceLine
                          y={70}
                          stroke="oklch(0.75 0.19 90)"
                          strokeDasharray="5 4"
                          strokeWidth={1.5}
                          label={{
                            value: "Low (70)",
                            position: "right",
                            fontSize: 10,
                            fill: "oklch(0.65 0.19 80)",
                          }}
                        />
                        <ReferenceLine
                          y={140}
                          stroke="oklch(0.55 0.22 25)"
                          strokeDasharray="5 4"
                          strokeWidth={1.5}
                          label={{
                            value: "High (140)",
                            position: "right",
                            fontSize: 10,
                            fill: "oklch(0.55 0.22 25)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="glucose"
                          stroke="var(--color-primary)"
                          strokeWidth={2.5}
                          dot={{
                            fill: "var(--color-primary)",
                            r: 3,
                            strokeWidth: 0,
                          }}
                          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                          name="Glucose"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={BarChart2}
                      title="No glucose data for this period"
                      description="Add glucose readings or select a wider time range to see trends."
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>

              {/* ── Weight Bar Chart ── */}
              <Card data-ocid="reports.weight-chart.card">
                <CardHeader>
                  <CardTitle>Weight Progress</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Body weight over the last {timeRange} days
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ChartSkeleton height={230} />
                  ) : weightData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart
                        data={weightData}
                        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                          width={42}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            fontSize: 12,
                          }}
                          labelStyle={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                          }}
                          formatter={(v: number) => [
                            `${v} ${weightFiltered[0]?.unit ?? "kg"}`,
                            "Weight",
                          ]}
                        />
                        <Legend
                          formatter={() =>
                            `Weight (${weightFiltered[0]?.unit ?? "kg"})`
                          }
                          iconType="rect"
                          iconSize={10}
                          wrapperStyle={{ fontSize: 12 }}
                        />
                        <Bar
                          dataKey="weight"
                          fill="var(--color-secondary)"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                          name="Weight"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={Scale}
                      title="No weight data for this period"
                      description="Add weight entries or select a wider time range to see progress."
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>

              {/* ── Health History Table ── */}
              <Card data-ocid="reports.history.card">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <CardTitle>Health History</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        All recorded entries — {filteredRows.length} records
                      </p>
                    </div>
                    <Select
                      value={typeFilter}
                      onValueChange={(v) =>
                        setTypeFilter(v as "all" | "glucose" | "weight")
                      }
                    >
                      <SelectTrigger
                        className="w-36"
                        data-ocid="reports.history.type-filter"
                      >
                        <SelectValue placeholder="Filter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="glucose">Glucose</SelectItem>
                        <SelectItem value="weight">Weight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="space-y-2 p-6">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-full rounded" />
                      ))}
                    </div>
                  ) : filteredRows.length === 0 ? (
                    <div
                      className="flex flex-col items-center gap-3 py-14 text-center"
                      data-ocid="reports.history.empty_state"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <BarChart2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        No entries found
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Try changing the type filter or add new health data.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-[160px]">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold text-xs hover:bg-transparent"
                                onClick={toggleSort}
                                data-ocid="reports.history.sort-date.button"
                              >
                                Date <SortIcon dir={sortDir} />
                              </Button>
                            </TableHead>
                            <TableHead className="w-[80px]">Time</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead className="w-[100px] text-right">
                              Value
                            </TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRows.map((row, i) => {
                            const isGlucose = row.type === "Glucose";
                            const status = isGlucose
                              ? getGlucoseStatus(row.value)
                              : null;
                            return (
                              <TableRow
                                key={`${row.type}-${String(row.ts)}-${i}`}
                                className="hover:bg-muted/30 transition-colors"
                                data-ocid={`reports.history.item.${i + 1}`}
                              >
                                <TableCell className="font-medium text-sm">
                                  {formatDateFull(row.ts)}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {formatTime(row.ts)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    {isGlucose ? (
                                      <Droplets className="h-3.5 w-3.5 text-primary" />
                                    ) : (
                                      <Scale className="h-3.5 w-3.5 text-secondary" />
                                    )}
                                    <span className="text-xs font-medium">
                                      {row.type}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold text-sm">
                                  <span
                                    className={
                                      isGlucose
                                        ? "text-primary"
                                        : "text-secondary"
                                    }
                                  >
                                    {row.value}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {row.unit}
                                  </span>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                  {row.notes || (
                                    <span className="opacity-40">—</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {status ? (
                                    <Badge
                                      variant={
                                        status.inRange
                                          ? "secondary"
                                          : "destructive"
                                      }
                                      className="text-[10px] px-2 py-0"
                                    >
                                      {status.label}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-2 py-0"
                                    >
                                      Logged
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ReportsPage;
