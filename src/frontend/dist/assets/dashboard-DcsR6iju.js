import { u as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-BSjU2GqU.js";
import { u as useBackendActor, c as useQuery, d as apiGetMyHealthEntries } from "./api-BZjA4YsM.js";
import { S as Sidebar, H as Header, C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./card-BSNiUgki.js";
import { c as createLucideIcon, u as useAuthStore, B as Button } from "./createLucideIcon-Bj0p1aTc.js";
import { S as Skeleton } from "./skeleton-qX9DC7jD.js";
import { D as Droplets } from "./droplets-CPv0yUz7.js";
import { S as Scale } from "./scale-D_dZpbYH.js";
import { C as ChartColumn, Z as Zap } from "./zap-BI2uRlC5.js";
import { T as TrendingUp } from "./trending-up-CUK8sXsU.js";
import { A as Activity } from "./activity-5DVtCZVZ.js";
import "./users-D1zWgAno.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
function getGlucoseStatus(value) {
  if (value < 70) return { label: "LOW", variant: "outline" };
  if (value > 140) return { label: "HIGH", variant: "destructive" };
  return { label: "NORMAL", variant: "secondary" };
}
function formatTime(ts) {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function isThisWeek(ts) {
  const d = new Date(Number(ts));
  const now = /* @__PURE__ */ new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", "data-ocid": "dashboard.loading_state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-28" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-28" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20" })
        ] }, i)) })
      ] })
    ] })
  ] });
}
function EmptyRecentEntries({ onAdd }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-4 py-10 text-center",
      "data-ocid": "dashboard.recent-entries.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-7 w-7 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: "No health entries yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Start tracking your glucose and weight to see your history here." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: onAdd,
            "data-ocid": "dashboard.recent-entries.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Add Your First Entry"
            ]
          }
        )
      ]
    }
  );
}
function DashboardPage() {
  var _a;
  const { currentUser, sessionToken, isAuthenticated, isAdmin } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const navigate = useNavigate();
  const { data: healthPage, isLoading } = useQuery({
    queryKey: ["my-health", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      return apiGetMyHealthEntries(actor, sessionToken, BigInt(0), BigInt(50));
    },
    enabled: !!actor && !isFetching && !!sessionToken
  });
  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  if (isAdmin) {
    navigate({ to: "/admin/dashboard" });
    return null;
  }
  const glucoseEntries = [
    ...(healthPage == null ? void 0 : healthPage.glucoseEntries) ?? []
  ].sort((a, b) => Number(b.readingTime) - Number(a.readingTime));
  const weightEntries = [
    ...(healthPage == null ? void 0 : healthPage.weightEntries) ?? []
  ].sort((a, b) => Number(b.recordedAt) - Number(a.recordedAt));
  const latestGlucose = glucoseEntries[0];
  const now = /* @__PURE__ */ new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const todayGlucose = glucoseEntries.find(
    (e) => Number(e.readingTime) >= todayStart
  );
  const todayWeight = weightEntries.find(
    (e) => Number(e.recordedAt) >= todayStart
  );
  const weeklyReadings = glucoseEntries.filter((e) => isThisWeek(e.readingTime)).length + weightEntries.filter((e) => isThisWeek(e.recordedAt)).length;
  const weekGlucose = glucoseEntries.filter((e) => isThisWeek(e.readingTime));
  const avgGlucose = weekGlucose.length > 0 ? Math.round(
    weekGlucose.reduce((sum, e) => sum + e.value, 0) / weekGlucose.length
  ) : null;
  const recentEntries = [
    ...glucoseEntries.map((e) => ({
      kind: "glucose",
      entry: e,
      sortTs: Number(e.readingTime)
    })),
    ...weightEntries.map((e) => ({
      kind: "weight",
      entry: e,
      sortTs: Number(e.recordedAt)
    }))
  ].sort((a, b) => b.sortTs - a.sortTs).slice(0, 5);
  const greetingHour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
  const firstName = ((_a = currentUser == null ? void 0 : currentUser.fullName) == null ? void 0 : _a.split(" ")[0]) ?? "there";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { variant: "user" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-4 py-8 sm:px-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", "data-ocid": "dashboard.page", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground sm:text-3xl", children: [
              greeting,
              ", ",
              firstName,
              "!"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: now.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/add-data", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "dashboard.add_data.primary_button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add Data"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
            "data-ocid": "dashboard.stats.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  className: "border-l-4 border-l-primary",
                  "data-ocid": "dashboard.today-glucose.card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Today's Glucose" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "h-4 w-4 text-primary" }) })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: todayGlucose ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-primary", children: todayGlucose.value }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-0.5 text-sm font-medium text-muted-foreground", children: todayGlucose.unit })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: getGlucoseStatus(todayGlucose.value).variant,
                            className: "text-xs",
                            children: getGlucoseStatus(todayGlucose.value).label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTime(todayGlucose.readingTime) })
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold text-muted-foreground", children: "No readings today" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Link,
                        {
                          to: "/add-data",
                          search: { tab: "glucose" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs font-medium text-primary hover:underline", children: "Add one now →" })
                        }
                      )
                    ] }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  className: "border-l-4 border-l-secondary",
                  "data-ocid": "dashboard.today-weight.card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Today's Weight" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4 w-4 text-secondary" }) })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: todayWeight ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-secondary", children: todayWeight.value }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-0.5 text-sm font-medium text-muted-foreground", children: todayWeight.unit })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
                        "Recorded at ",
                        formatTime(todayWeight.recordedAt)
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold text-muted-foreground", children: "Not recorded" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Link,
                        {
                          to: "/add-data",
                          search: { tab: "weight" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs font-medium text-secondary hover:underline", children: "Log weight →" })
                        }
                      )
                    ] }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.weekly-readings.card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Weekly Readings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-foreground", children: weeklyReadings }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-0.5 text-sm text-muted-foreground", children: "entries" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
                    weekGlucose.length,
                    " glucose &",
                    " ",
                    weeklyReadings - weekGlucose.length,
                    " weight this week"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.avg-glucose.card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Average Glucose" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: avgGlucose !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-primary", children: avgGlucose }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-0.5 text-sm text-muted-foreground", children: (latestGlucose == null ? void 0 : latestGlucose.unit) ?? "mg/dL" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: getGlucoseStatus(avgGlucose).variant,
                        className: "text-xs",
                        children: getGlucoseStatus(avgGlucose).label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "7-day avg" })
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold text-muted-foreground", children: "N/A" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "No glucose this week" })
                ] }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.quick-actions.card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
              "Quick Actions"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/add-data",
                  search: { tab: "glucose" },
                  className: "block",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "w-full justify-start gap-3",
                      "data-ocid": "dashboard.add-blood-sugar.button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded bg-primary-foreground/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "h-3.5 w-3.5" }) }),
                        "Add Blood Sugar"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/add-data",
                  search: { tab: "weight" },
                  className: "block",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: "w-full justify-start gap-3 border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary",
                      "data-ocid": "dashboard.add-weight.button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3.5 w-3.5" }) }),
                        "Add Weight"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reports", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
                  "data-ocid": "dashboard.view-reports.button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
                    "View Reports"
                  ]
                }
              ) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "lg:col-span-2",
              "data-ocid": "dashboard.recent-entries.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
                    "Recent Entries"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reports", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "text-xs text-muted-foreground hover:text-foreground",
                      "data-ocid": "dashboard.all-entries.link",
                      children: "View all"
                    }
                  ) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: recentEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EmptyRecentEntries,
                  {
                    onAdd: () => navigate({ to: "/add-data" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: recentEntries.map((item, i) => {
                  if (item.kind === "glucose") {
                    const e2 = item.entry;
                    const status = getGlucoseStatus(e2.value);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30",
                        "data-ocid": `dashboard.recent-entries.item.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "h-4.5 w-4.5 text-primary" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Blood Sugar" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                              formatDate(e2.readingTime),
                              " ·",
                              " ",
                              formatTime(e2.readingTime)
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg font-bold text-primary", children: [
                              e2.value,
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground", children: e2.unit })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Badge,
                              {
                                variant: status.variant,
                                className: "text-xs",
                                children: status.label
                              }
                            )
                          ] })
                        ]
                      },
                      `g-${String(e2.id)}`
                    );
                  }
                  const e = item.entry;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30",
                      "data-ocid": `dashboard.recent-entries.item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4 w-4 text-secondary" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Weight" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            formatDate(e.recordedAt),
                            " ·",
                            " ",
                            formatTime(e.recordedAt)
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg font-bold text-secondary", children: [
                            e.value,
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground", children: e.unit })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: "secondary",
                              className: "text-xs",
                              children: "LOGGED"
                            }
                          )
                        ] })
                      ]
                    },
                    `w-${String(e.id)}`
                  );
                }) }) })
              ]
            }
          )
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  DashboardPage,
  DashboardPage as default
};
