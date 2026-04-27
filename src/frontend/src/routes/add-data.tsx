import {
  apiAddGlucoseEntry,
  apiAddWeightEntry,
  apiGetMyHealthEntries,
  useBackendActor,
} from "@/api";
import { GlucoseUnit, WeightUnit } from "@/backend";
import type { GlucoseEntry, WeightEntry } from "@/backend";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Scale,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "glucose" | "weight";

type HistoryRow =
  | { kind: "glucose"; entry: GlucoseEntry }
  | { kind: "weight"; entry: WeightEntry };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDatetimeValue(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTs(ts: bigint): string {
  const d = new Date(Number(ts));
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function glucoseUnitLabel(u: GlucoseUnit) {
  return u === GlucoseUnit.mgdl ? "mg/dL" : "mmol/L";
}

function weightUnitLabel(u: WeightUnit) {
  return u === WeightUnit.kg ? "kg" : "lbs";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AddDataPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, sessionToken } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const queryClient = useQueryClient();

  // Read ?tab= query param
  const search = useSearch({ strict: false }) as { tab?: string };
  const initialTab: Tab = search.tab === "weight" ? "weight" : "glucose";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // ── Glucose form state ──────────────────────────────────────────────────────
  const [glucose, setGlucose] = useState({
    value: "",
    unit: GlucoseUnit.mgdl,
    datetime: toLocalDatetimeValue(Date.now()),
    notes: "",
  });
  const [glucoseErrors, setGlucoseErrors] = useState<{
    value?: string;
    datetime?: string;
  }>({});
  const [glucoseLoading, setGlucoseLoading] = useState(false);

  // ── Weight form state ───────────────────────────────────────────────────────
  const [weight, setWeight] = useState({
    value: "",
    unit: WeightUnit.kg,
    datetime: toLocalDatetimeValue(Date.now()),
    notes: "",
  });
  const [weightErrors, setWeightErrors] = useState<{
    value?: string;
    datetime?: string;
  }>({});
  const [weightLoading, setWeightLoading] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (isAdmin) navigate({ to: "/admin/dashboard" });
  }, [isAuthenticated, isAdmin, navigate]);

  // ── History query ───────────────────────────────────────────────────────────
  const { data: healthPage, isLoading: historyLoading } = useQuery({
    queryKey: ["my-health", "add-data"],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiGetMyHealthEntries(actor, sessionToken, BigInt(0), BigInt(10));
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchOnWindowFocus: false,
  });

  // Build merged history rows sorted newest first, filter deleted
  const historyRows: HistoryRow[] = [];
  if (healthPage) {
    for (const g of healthPage.glucoseEntries) {
      if (!deletedIds.has(`g-${g.id}`)) {
        historyRows.push({ kind: "glucose", entry: g });
      }
    }
    for (const w of healthPage.weightEntries) {
      if (!deletedIds.has(`w-${w.id}`)) {
        historyRows.push({ kind: "weight", entry: w });
      }
    }
  }
  historyRows.sort((a, b) => {
    const tsA = a.kind === "glucose" ? a.entry.readingTime : a.entry.recordedAt;
    const tsB = b.kind === "glucose" ? b.entry.readingTime : b.entry.recordedAt;
    return Number(tsB - tsA);
  });
  const displayedRows = historyRows.slice(0, 10);

  // ── Banner auto-dismiss ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!successBanner) return;
    const t = setTimeout(() => setSuccessBanner(null), 5000);
    return () => clearTimeout(t);
  }, [successBanner]);

  if (!isAuthenticated || isAdmin) return null;

  // ── Glucose submit ──────────────────────────────────────────────────────────
  const handleGlucoseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof glucoseErrors = {};
    const parsed = Number(glucose.value);

    if (!glucose.value || Number.isNaN(parsed)) {
      errors.value = "Enter a valid number";
    } else if (parsed <= 0) {
      errors.value = "Value must be greater than 0";
    } else if (parsed > 500) {
      errors.value = "Value must be ≤ 500 mg/dL";
    }
    if (!glucose.datetime) {
      errors.datetime = "Date & time is required";
    }
    if (Object.keys(errors).length > 0) {
      setGlucoseErrors(errors);
      return;
    }
    if (!actor || !sessionToken || isFetching) return;

    setGlucoseLoading(true);
    try {
      await apiAddGlucoseEntry(actor, sessionToken, {
        value: parsed,
        unit: glucose.unit,
        readingTime: BigInt(new Date(glucose.datetime).getTime()),
        notes: glucose.notes,
      });
      setGlucose({
        value: "",
        unit: GlucoseUnit.mgdl,
        datetime: toLocalDatetimeValue(Date.now()),
        notes: "",
      });
      setGlucoseErrors({});
      setTodayCount((c) => c + 1);
      setSuccessBanner("Reading saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-health"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setGlucoseLoading(false);
    }
  };

  // ── Weight submit ───────────────────────────────────────────────────────────
  const handleWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof weightErrors = {};
    const parsed = Number(weight.value);

    if (!weight.value || Number.isNaN(parsed)) {
      errors.value = "Enter a valid number";
    } else if (parsed <= 0) {
      errors.value = "Value must be greater than 0";
    }
    if (!weight.datetime) {
      errors.datetime = "Date & time is required";
    }
    if (Object.keys(errors).length > 0) {
      setWeightErrors(errors);
      return;
    }
    if (!actor || !sessionToken || isFetching) return;

    setWeightLoading(true);
    try {
      await apiAddWeightEntry(actor, sessionToken, {
        value: parsed,
        unit: weight.unit,
        recordedAt: BigInt(new Date(weight.datetime).getTime()),
        notes: weight.notes,
      });
      setWeight({
        value: "",
        unit: WeightUnit.kg,
        datetime: toLocalDatetimeValue(Date.now()),
        notes: "",
      });
      setWeightErrors({});
      setTodayCount((c) => c + 1);
      setSuccessBanner("Reading saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-health"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setWeightLoading(false);
    }
  };

  // ── Delete row (client-side hide) ──────────────────────────────────────────
  const handleDelete = (row: HistoryRow) => {
    const key =
      row.kind === "glucose" ? `g-${row.entry.id}` : `w-${row.entry.id}`;
    setDeletedIds((prev) => new Set([...prev, key]));
    toast.success("Entry removed from view");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="user" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          <div
            className="mx-auto max-w-4xl px-6 py-8 space-y-6"
            data-ocid="add-data.page"
          >
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Add Health Data
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Log your glucose readings and weight to track your progress
                </p>
              </div>
              {todayCount > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
                  <CheckCircle2 className="h-4 w-4" />
                  {todayCount} reading{todayCount !== 1 ? "s" : ""} added today
                </div>
              )}
            </div>

            {/* Success Banner */}
            {successBanner && (
              <div
                className="flex items-center gap-3 rounded-lg border border-secondary/30 bg-secondary/10 px-5 py-3 text-secondary font-medium"
                data-ocid="add-data.success_state"
                aria-live="polite"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{successBanner}</span>
              </div>
            )}

            {/* Tab switcher */}
            <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-1.5 w-fit">
              {(["glucose", "weight"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`add-data.${tab}.tab`}
                >
                  {tab === "glucose" ? (
                    <Activity className="h-4 w-4" />
                  ) : (
                    <Scale className="h-4 w-4" />
                  )}
                  {tab === "glucose" ? "Blood Sugar" : "Weight"}
                </button>
              ))}
            </div>

            {/* Glucose Form */}
            {activeTab === "glucose" && (
              <Card data-ocid="add-data.glucose.card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    Blood Glucose Reading
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleGlucoseSubmit}
                    className="space-y-5 max-w-lg"
                    noValidate
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="glucose-val"
                          className="text-sm font-medium text-foreground"
                        >
                          Glucose Value
                          <span className="text-destructive ml-0.5">*</span>
                        </label>
                        <Input
                          id="glucose-val"
                          type="number"
                          min={0}
                          max={500}
                          step="any"
                          placeholder="98"
                          value={glucose.value}
                          onChange={(e) => {
                            setGlucose((p) => ({
                              ...p,
                              value: e.target.value,
                            }));
                            setGlucoseErrors((p) => ({
                              ...p,
                              value: undefined,
                            }));
                          }}
                          data-ocid="add-data.glucose.value.input"
                          aria-invalid={!!glucoseErrors.value}
                        />
                        {glucoseErrors.value && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="add-data.glucose.value.field_error"
                          >
                            {glucoseErrors.value}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="glucose-unit"
                          className="text-sm font-medium text-foreground"
                        >
                          Unit
                        </label>
                        <select
                          id="glucose-unit"
                          value={glucose.unit}
                          onChange={(e) =>
                            setGlucose((p) => ({
                              ...p,
                              unit: e.target.value as GlucoseUnit,
                            }))
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          data-ocid="add-data.glucose.unit.select"
                        >
                          <option value={GlucoseUnit.mgdl}>mg/dL</option>
                          <option value={GlucoseUnit.mmoll}>mmol/L</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="glucose-datetime"
                        className="text-sm font-medium text-foreground"
                      >
                        Date & Time
                        <span className="text-destructive ml-0.5">*</span>
                      </label>
                      <Input
                        id="glucose-datetime"
                        type="datetime-local"
                        value={glucose.datetime}
                        onChange={(e) => {
                          setGlucose((p) => ({
                            ...p,
                            datetime: e.target.value,
                          }));
                          setGlucoseErrors((p) => ({
                            ...p,
                            datetime: undefined,
                          }));
                        }}
                        data-ocid="add-data.glucose.datetime.input"
                        aria-invalid={!!glucoseErrors.datetime}
                      />
                      {glucoseErrors.datetime && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="add-data.glucose.datetime.field_error"
                        >
                          {glucoseErrors.datetime}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="glucose-notes"
                        className="text-sm font-medium text-foreground"
                      >
                        Notes{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="glucose-notes"
                        rows={3}
                        placeholder="After meal, fasting, before exercise..."
                        value={glucose.notes}
                        onChange={(e) =>
                          setGlucose((p) => ({ ...p, notes: e.target.value }))
                        }
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        data-ocid="add-data.glucose.notes.textarea"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={glucoseLoading || isFetching}
                      className="w-full sm:w-auto"
                      data-ocid="add-data.glucose.submit_button"
                    >
                      {glucoseLoading ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"
                            aria-hidden
                          />
                          Saving...
                        </span>
                      ) : (
                        "Save Glucose Reading"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Weight Form */}
            {activeTab === "weight" && (
              <Card data-ocid="add-data.weight.card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                      <Scale className="h-4 w-4 text-secondary" />
                    </div>
                    Body Weight Entry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleWeightSubmit}
                    className="space-y-5 max-w-lg"
                    noValidate
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="weight-val"
                          className="text-sm font-medium text-foreground"
                        >
                          Weight Value
                          <span className="text-destructive ml-0.5">*</span>
                        </label>
                        <Input
                          id="weight-val"
                          type="number"
                          min={0}
                          step="any"
                          placeholder="72"
                          value={weight.value}
                          onChange={(e) => {
                            setWeight((p) => ({ ...p, value: e.target.value }));
                            setWeightErrors((p) => ({
                              ...p,
                              value: undefined,
                            }));
                          }}
                          data-ocid="add-data.weight.value.input"
                          aria-invalid={!!weightErrors.value}
                        />
                        {weightErrors.value && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="add-data.weight.value.field_error"
                          >
                            {weightErrors.value}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="weight-unit"
                          className="text-sm font-medium text-foreground"
                        >
                          Unit
                        </label>
                        <select
                          id="weight-unit"
                          value={weight.unit}
                          onChange={(e) =>
                            setWeight((p) => ({
                              ...p,
                              unit: e.target.value as WeightUnit,
                            }))
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          data-ocid="add-data.weight.unit.select"
                        >
                          <option value={WeightUnit.kg}>kg</option>
                          <option value={WeightUnit.lbs}>lbs</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="weight-datetime"
                        className="text-sm font-medium text-foreground"
                      >
                        Date & Time
                        <span className="text-destructive ml-0.5">*</span>
                      </label>
                      <Input
                        id="weight-datetime"
                        type="datetime-local"
                        value={weight.datetime}
                        onChange={(e) => {
                          setWeight((p) => ({
                            ...p,
                            datetime: e.target.value,
                          }));
                          setWeightErrors((p) => ({
                            ...p,
                            datetime: undefined,
                          }));
                        }}
                        data-ocid="add-data.weight.datetime.input"
                        aria-invalid={!!weightErrors.datetime}
                      />
                      {weightErrors.datetime && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="add-data.weight.datetime.field_error"
                        >
                          {weightErrors.datetime}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="weight-notes"
                        className="text-sm font-medium text-foreground"
                      >
                        Notes{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="weight-notes"
                        rows={3}
                        placeholder="Morning weigh-in, after workout..."
                        value={weight.notes}
                        onChange={(e) =>
                          setWeight((p) => ({ ...p, notes: e.target.value }))
                        }
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        data-ocid="add-data.weight.notes.textarea"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={weightLoading || isFetching}
                      className="w-full sm:w-auto"
                      data-ocid="add-data.weight.submit_button"
                    >
                      {weightLoading ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"
                            aria-hidden
                          />
                          Saving...
                        </span>
                      ) : (
                        "Save Weight Entry"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Recent History */}
            <Card data-ocid="add-data.history.card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Recent History
                  <span className="text-xs font-normal text-muted-foreground">
                    (last 10 entries)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {historyLoading ? (
                  <div
                    className="space-y-3 p-5"
                    data-ocid="add-data.history.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-7 w-7 rounded" />
                      </div>
                    ))}
                  </div>
                ) : displayedRows.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-12 px-6 text-center"
                    data-ocid="add-data.history.empty_state"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                      <ClipboardList className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">
                      No entries yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add your first reading above to start tracking your
                      health.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Date &amp; Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Type
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Value
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Notes
                          </th>
                          <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedRows.map((row, idx) => {
                          const isGlucose = row.kind === "glucose";
                          const ts = isGlucose
                            ? (row.entry as GlucoseEntry).readingTime
                            : (row.entry as WeightEntry).recordedAt;
                          const valueStr = isGlucose
                            ? `${(row.entry as GlucoseEntry).value} ${glucoseUnitLabel((row.entry as GlucoseEntry).unit)}`
                            : `${(row.entry as WeightEntry).value} ${weightUnitLabel((row.entry as WeightEntry).unit)}`;
                          const notes = isGlucose
                            ? (row.entry as GlucoseEntry).notes
                            : (row.entry as WeightEntry).notes;

                          return (
                            <tr
                              key={`${row.kind}-${row.entry.id}`}
                              className="border-b border-border/60 transition-colors duration-150 hover:bg-muted/20"
                              data-ocid={`add-data.history.item.${idx + 1}`}
                            >
                              <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                                {formatTs(ts)}
                              </td>
                              <td className="px-4 py-3.5">
                                <Badge
                                  variant="outline"
                                  className={
                                    isGlucose
                                      ? "border-primary/30 bg-primary/5 text-primary text-xs"
                                      : "border-secondary/30 bg-secondary/5 text-secondary text-xs"
                                  }
                                >
                                  {isGlucose ? (
                                    <Activity className="mr-1 h-3 w-3" />
                                  ) : (
                                    <Scale className="mr-1 h-3 w-3" />
                                  )}
                                  {isGlucose ? "Glucose" : "Weight"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3.5 text-right font-semibold text-foreground tabular-nums">
                                {valueStr}
                              </td>
                              <td className="px-4 py-3.5 text-muted-foreground max-w-[200px] truncate">
                                {notes || (
                                  <span className="text-muted-foreground/50 italic">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(row)}
                                  aria-label="Delete entry"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  data-ocid={`add-data.history.delete_button.${idx + 1}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="font-medium text-foreground mb-2">
                💡 Tips for accurate readings
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Check glucose before meals for fasting readings</li>
                <li>
                  • Weigh yourself at the same time daily (morning is best)
                </li>
                <li>• Add notes to track patterns with meals and activity</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddDataPage;
