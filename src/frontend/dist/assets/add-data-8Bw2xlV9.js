import { u as useNavigate, d as useQueryClient, e as useSearch, r as reactExports, j as jsxRuntimeExports, b as ue } from "./index-BSjU2GqU.js";
import { u as useBackendActor, c as useQuery, e as apiAddGlucoseEntry, f as apiAddWeightEntry, d as apiGetMyHealthEntries } from "./api-BZjA4YsM.js";
import { c as createLucideIcon, u as useAuthStore, G as GlucoseUnit, W as WeightUnit, B as Button } from "./createLucideIcon-Bj0p1aTc.js";
import { S as Sidebar, H as Header, C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./card-BSNiUgki.js";
import { I as Input } from "./input-BhuIoUB-.js";
import { S as Skeleton } from "./skeleton-qX9DC7jD.js";
import { C as CircleCheck } from "./circle-check-mBSz3tsM.js";
import { A as Activity } from "./activity-5DVtCZVZ.js";
import { S as Scale } from "./scale-D_dZpbYH.js";
import "./users-D1zWgAno.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function toLocalDatetimeValue(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function formatTs(ts) {
  const d = new Date(Number(ts));
  return d.toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function glucoseUnitLabel(u) {
  return u === GlucoseUnit.mgdl ? "mg/dL" : "mmol/L";
}
function weightUnitLabel(u) {
  return u === WeightUnit.kg ? "kg" : "lbs";
}
function AddDataPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, sessionToken } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const queryClient = useQueryClient();
  const search = useSearch({ strict: false });
  const initialTab = search.tab === "weight" ? "weight" : "glucose";
  const [activeTab, setActiveTab] = reactExports.useState(initialTab);
  const [successBanner, setSuccessBanner] = reactExports.useState(null);
  const [todayCount, setTodayCount] = reactExports.useState(0);
  const [deletedIds, setDeletedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [glucose, setGlucose] = reactExports.useState({
    value: "",
    unit: GlucoseUnit.mgdl,
    datetime: toLocalDatetimeValue(Date.now()),
    notes: ""
  });
  const [glucoseErrors, setGlucoseErrors] = reactExports.useState({});
  const [glucoseLoading, setGlucoseLoading] = reactExports.useState(false);
  const [weight, setWeight] = reactExports.useState({
    value: "",
    unit: WeightUnit.kg,
    datetime: toLocalDatetimeValue(Date.now()),
    notes: ""
  });
  const [weightErrors, setWeightErrors] = reactExports.useState({});
  const [weightLoading, setWeightLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (isAdmin) navigate({ to: "/admin/dashboard" });
  }, [isAuthenticated, isAdmin, navigate]);
  const { data: healthPage, isLoading: historyLoading } = useQuery({
    queryKey: ["my-health", "add-data"],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiGetMyHealthEntries(actor, sessionToken, BigInt(0), BigInt(10));
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchOnWindowFocus: false
  });
  const historyRows = [];
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
  reactExports.useEffect(() => {
    if (!successBanner) return;
    const t = setTimeout(() => setSuccessBanner(null), 5e3);
    return () => clearTimeout(t);
  }, [successBanner]);
  if (!isAuthenticated || isAdmin) return null;
  const handleGlucoseSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
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
        notes: glucose.notes
      });
      setGlucose({
        value: "",
        unit: GlucoseUnit.mgdl,
        datetime: toLocalDatetimeValue(Date.now()),
        notes: ""
      });
      setGlucoseErrors({});
      setTodayCount((c) => c + 1);
      setSuccessBanner("Reading saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-health"] });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setGlucoseLoading(false);
    }
  };
  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
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
        notes: weight.notes
      });
      setWeight({
        value: "",
        unit: WeightUnit.kg,
        datetime: toLocalDatetimeValue(Date.now()),
        notes: ""
      });
      setWeightErrors({});
      setTodayCount((c) => c + 1);
      setSuccessBanner("Reading saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-health"] });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setWeightLoading(false);
    }
  };
  const handleDelete = (row) => {
    const key = row.kind === "glucose" ? `g-${row.entry.id}` : `w-${row.entry.id}`;
    setDeletedIds((prev) => /* @__PURE__ */ new Set([...prev, key]));
    ue.success("Entry removed from view");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { variant: "user" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mx-auto max-w-4xl px-6 py-8 space-y-6",
          "data-ocid": "add-data.page",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Add Health Data" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Log your glucose readings and weight to track your progress" })
              ] }),
              todayCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                todayCount,
                " reading",
                todayCount !== 1 ? "s" : "",
                " added today"
              ] })
            ] }),
            successBanner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 rounded-lg border border-secondary/30 bg-secondary/10 px-5 py-3 text-secondary font-medium",
                "data-ocid": "add-data.success_state",
                "aria-live": "polite",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: successBanner })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 rounded-xl border border-border bg-muted/40 p-1.5 w-fit", children: ["glucose", "weight"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab),
                className: `flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `add-data.${tab}.tab`,
                children: [
                  tab === "glucose" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4 w-4" }),
                  tab === "glucose" ? "Blood Sugar" : "Weight"
                ]
              },
              tab
            )) }),
            activeTab === "glucose" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "add-data.glucose.card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }) }),
                "Blood Glucose Reading"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleGlucoseSubmit,
                  className: "space-y-5 max-w-lg",
                  noValidate: true,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            htmlFor: "glucose-val",
                            className: "text-sm font-medium text-foreground",
                            children: [
                              "Glucose Value",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-0.5", children: "*" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "glucose-val",
                            type: "number",
                            min: 0,
                            max: 500,
                            step: "any",
                            placeholder: "98",
                            value: glucose.value,
                            onChange: (e) => {
                              setGlucose((p) => ({
                                ...p,
                                value: e.target.value
                              }));
                              setGlucoseErrors((p) => ({
                                ...p,
                                value: void 0
                              }));
                            },
                            "data-ocid": "add-data.glucose.value.input",
                            "aria-invalid": !!glucoseErrors.value
                          }
                        ),
                        glucoseErrors.value && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs text-destructive",
                            "data-ocid": "add-data.glucose.value.field_error",
                            children: glucoseErrors.value
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "glucose-unit",
                            className: "text-sm font-medium text-foreground",
                            children: "Unit"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "select",
                          {
                            id: "glucose-unit",
                            value: glucose.unit,
                            onChange: (e) => setGlucose((p) => ({
                              ...p,
                              unit: e.target.value
                            })),
                            className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                            "data-ocid": "add-data.glucose.unit.select",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: GlucoseUnit.mgdl, children: "mg/dL" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: GlucoseUnit.mmoll, children: "mmol/L" })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "glucose-datetime",
                          className: "text-sm font-medium text-foreground",
                          children: [
                            "Date & Time",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-0.5", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "glucose-datetime",
                          type: "datetime-local",
                          value: glucose.datetime,
                          onChange: (e) => {
                            setGlucose((p) => ({
                              ...p,
                              datetime: e.target.value
                            }));
                            setGlucoseErrors((p) => ({
                              ...p,
                              datetime: void 0
                            }));
                          },
                          "data-ocid": "add-data.glucose.datetime.input",
                          "aria-invalid": !!glucoseErrors.datetime
                        }
                      ),
                      glucoseErrors.datetime && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs text-destructive",
                          "data-ocid": "add-data.glucose.datetime.field_error",
                          children: glucoseErrors.datetime
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "glucose-notes",
                          className: "text-sm font-medium text-foreground",
                          children: [
                            "Notes",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          id: "glucose-notes",
                          rows: 3,
                          placeholder: "After meal, fasting, before exercise...",
                          value: glucose.notes,
                          onChange: (e) => setGlucose((p) => ({ ...p, notes: e.target.value })),
                          className: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none",
                          "data-ocid": "add-data.glucose.notes.textarea"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        disabled: glucoseLoading || isFetching,
                        className: "w-full sm:w-auto",
                        "data-ocid": "add-data.glucose.submit_button",
                        children: glucoseLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent",
                              "aria-hidden": true
                            }
                          ),
                          "Saving..."
                        ] }) : "Save Glucose Reading"
                      }
                    )
                  ]
                }
              ) })
            ] }),
            activeTab === "weight" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "add-data.weight.card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4 w-4 text-secondary" }) }),
                "Body Weight Entry"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleWeightSubmit,
                  className: "space-y-5 max-w-lg",
                  noValidate: true,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            htmlFor: "weight-val",
                            className: "text-sm font-medium text-foreground",
                            children: [
                              "Weight Value",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-0.5", children: "*" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "weight-val",
                            type: "number",
                            min: 0,
                            step: "any",
                            placeholder: "72",
                            value: weight.value,
                            onChange: (e) => {
                              setWeight((p) => ({ ...p, value: e.target.value }));
                              setWeightErrors((p) => ({
                                ...p,
                                value: void 0
                              }));
                            },
                            "data-ocid": "add-data.weight.value.input",
                            "aria-invalid": !!weightErrors.value
                          }
                        ),
                        weightErrors.value && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs text-destructive",
                            "data-ocid": "add-data.weight.value.field_error",
                            children: weightErrors.value
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "weight-unit",
                            className: "text-sm font-medium text-foreground",
                            children: "Unit"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "select",
                          {
                            id: "weight-unit",
                            value: weight.unit,
                            onChange: (e) => setWeight((p) => ({
                              ...p,
                              unit: e.target.value
                            })),
                            className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                            "data-ocid": "add-data.weight.unit.select",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: WeightUnit.kg, children: "kg" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: WeightUnit.lbs, children: "lbs" })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "weight-datetime",
                          className: "text-sm font-medium text-foreground",
                          children: [
                            "Date & Time",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-0.5", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "weight-datetime",
                          type: "datetime-local",
                          value: weight.datetime,
                          onChange: (e) => {
                            setWeight((p) => ({
                              ...p,
                              datetime: e.target.value
                            }));
                            setWeightErrors((p) => ({
                              ...p,
                              datetime: void 0
                            }));
                          },
                          "data-ocid": "add-data.weight.datetime.input",
                          "aria-invalid": !!weightErrors.datetime
                        }
                      ),
                      weightErrors.datetime && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs text-destructive",
                          "data-ocid": "add-data.weight.datetime.field_error",
                          children: weightErrors.datetime
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "weight-notes",
                          className: "text-sm font-medium text-foreground",
                          children: [
                            "Notes",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          id: "weight-notes",
                          rows: 3,
                          placeholder: "Morning weigh-in, after workout...",
                          value: weight.notes,
                          onChange: (e) => setWeight((p) => ({ ...p, notes: e.target.value })),
                          className: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none",
                          "data-ocid": "add-data.weight.notes.textarea"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        disabled: weightLoading || isFetching,
                        className: "w-full sm:w-auto",
                        "data-ocid": "add-data.weight.submit_button",
                        children: weightLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent",
                              "aria-hidden": true
                            }
                          ),
                          "Saving..."
                        ] }) : "Save Weight Entry"
                      }
                    )
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "add-data.history.card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b border-border pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-4 w-4 text-muted-foreground" }),
                "Recent History",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "(last 10 entries)" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "space-y-3 p-5",
                  "data-ocid": "add-data.history.loading_state",
                  children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 flex-1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-7 rounded" })
                  ] }, i))
                }
              ) : displayedRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-12 px-6 text-center",
                  "data-ocid": "add-data.history.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-6 w-6 text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "No entries yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Add your first reading above to start tracking your health." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Date & Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Value" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Notes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: displayedRows.map((row, idx) => {
                  const isGlucose = row.kind === "glucose";
                  const ts = isGlucose ? row.entry.readingTime : row.entry.recordedAt;
                  const valueStr = isGlucose ? `${row.entry.value} ${glucoseUnitLabel(row.entry.unit)}` : `${row.entry.value} ${weightUnitLabel(row.entry.unit)}`;
                  const notes = isGlucose ? row.entry.notes : row.entry.notes;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-b border-border/60 transition-colors duration-150 hover:bg-muted/20",
                      "data-ocid": `add-data.history.item.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground whitespace-nowrap", children: formatTs(ts) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            variant: "outline",
                            className: isGlucose ? "border-primary/30 bg-primary/5 text-primary text-xs" : "border-secondary/30 bg-secondary/5 text-secondary text-xs",
                            children: [
                              isGlucose ? /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "mr-1 h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "mr-1 h-3 w-3" }),
                              isGlucose ? "Glucose" : "Weight"
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-right font-semibold text-foreground tabular-nums", children: valueStr }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground max-w-[200px] truncate", children: notes || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 italic", children: "—" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleDelete(row),
                            "aria-label": "Delete entry",
                            className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "data-ocid": `add-data.history.delete_button.${idx + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                          }
                        ) })
                      ]
                    },
                    `${row.kind}-${row.entry.id}`
                  );
                }) })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-2", children: "💡 Tips for accurate readings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Check glucose before meals for fasting readings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Weigh yourself at the same time daily (morning is best)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Add notes to track patterns with meals and activity" })
              ] })
            ] })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  AddDataPage,
  AddDataPage as default
};
