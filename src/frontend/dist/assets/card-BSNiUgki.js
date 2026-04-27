import { j as jsxRuntimeExports, c as cn, r as reactExports, L as Link, t as useRouterState } from "./index-BSjU2GqU.js";
import { u as useBackendActor, n as apiGetUnreadNotificationCount, l as apiGetUnreadNotifications, i as apiMarkNotificationsRead } from "./api-BZjA4YsM.js";
import { c as createLucideIcon, S as Slot, e as cva, u as useAuthStore } from "./createLucideIcon-Bj0p1aTc.js";
import { U as Users } from "./users-D1zWgAno.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function Header() {
  const { currentUser, sessionToken, logout } = useAuthStore();
  const { actor } = useBackendActor();
  const [notifCount, setNotifCount] = reactExports.useState(0);
  const [dropdownOpen, setDropdownOpen] = reactExports.useState(false);
  const [notifOpen, setNotifOpen] = reactExports.useState(false);
  const [notifications, setNotifications] = reactExports.useState([]);
  const overlayRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!actor || !sessionToken) return;
    const fetchCount = async () => {
      try {
        const count = await apiGetUnreadNotificationCount(actor, sessionToken);
        setNotifCount(Number(count));
      } catch {
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 1e4);
    return () => clearInterval(interval);
  }, [actor, sessionToken]);
  const handleNotifOpen = async () => {
    setNotifOpen((v) => !v);
    if (!actor || !sessionToken) return;
    try {
      const items = await apiGetUnreadNotifications(actor, sessionToken);
      setNotifications(items);
      if (items.length > 0) {
        await apiMarkNotificationsRead(
          actor,
          sessionToken,
          items.map((n) => n.id)
        );
        setNotifCount(0);
      }
    } catch {
    }
  };
  const handleLogout = async () => {
    if (actor && sessionToken) {
      try {
        await actor.logout(sessionToken);
      } catch {
      }
    }
    logout();
  };
  const initials = (currentUser == null ? void 0 : currentUser.fullName) ? currentUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/",
        className: "flex items-center gap-2.5 font-display font-bold text-xl text-primary",
        "data-ocid": "header.logo.link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black", children: "G" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GlucoFit" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleNotifOpen,
            className: "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth",
            "aria-label": "Notifications",
            "data-ocid": "header.notifications.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
              notifCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground", children: notifCount > 9 ? "9+" : notifCount })
            ]
          }
        ),
        notifOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute right-0 top-11 z-50 w-80 rounded-xl border border-border bg-card shadow-lg",
            "data-ocid": "header.notifications.popover",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Notifications" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-72 overflow-y-auto", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-6 text-center text-sm text-muted-foreground", children: "No new notifications" }) : notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 border-b border-border px-4 py-3 last:border-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${n.kind === "glucose" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`,
                        children: n.kind === "glucose" ? "G" : "W"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: n.userName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        n.kind === "glucose" ? "Glucose" : "Weight",
                        ":",
                        " ",
                        n.value,
                        " ",
                        n.unit
                      ] })
                    ] })
                  ]
                },
                String(n.id)
              )) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDropdownOpen((v) => !v),
            className: "flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-smooth",
            "data-ocid": "header.user.dropdown",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold", children: initials }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm font-medium text-foreground sm:block max-w-[120px] truncate", children: (currentUser == null ? void 0 : currentUser.fullName) ?? "User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
            ]
          }
        ),
        dropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-11 z-50 w-48 rounded-xl border border-border bg-card shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/profile",
              className: "flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-t-xl transition-smooth",
              onClick: () => setDropdownOpen(false),
              "data-ocid": "header.profile.link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                "Profile"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleLogout,
              className: "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-b-xl transition-smooth",
              "data-ocid": "header.logout.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
                "Sign Out"
              ]
            }
          )
        ] })
      ] })
    ] }),
    (dropdownOpen || notifOpen) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: overlayRef,
        className: "fixed inset-0 z-30",
        onClick: () => {
          setDropdownOpen(false);
          setNotifOpen(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            setDropdownOpen(false);
            setNotifOpen(false);
          }
        },
        role: "button",
        tabIndex: -1,
        "aria-label": "Close dropdowns"
      }
    )
  ] });
}
function AdminHeader() {
  const { currentUser, sessionToken, logout } = useAuthStore();
  const { actor } = useBackendActor();
  const [notifCount, setNotifCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!actor || !sessionToken) return;
    const fetchCount = async () => {
      try {
        const count = await apiGetUnreadNotificationCount(actor, sessionToken);
        setNotifCount(Number(count));
      } catch {
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 1e4);
    return () => clearInterval(interval);
  }, [actor, sessionToken]);
  const handleLogout = async () => {
    if (actor && sessionToken) {
      try {
        await actor.logout(sessionToken);
      } catch {
      }
    }
    logout();
  };
  const initials = (currentUser == null ? void 0 : currentUser.fullName) ? currentUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "A";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 font-display font-bold text-xl text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black", children: "G" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GlucoFit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 text-xs", children: "Admin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      notifCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
        notifCount,
        " new"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold", children: initials }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm font-medium text-foreground sm:block", children: (currentUser == null ? void 0 : currentUser.fullName) ?? "Admin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleLogout,
          className: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-destructive hover:bg-destructive/5 transition-smooth",
          "data-ocid": "admin.header.logout.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            "Sign Out"
          ]
        }
      )
    ] })
  ] });
}
const userNavItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    ocid: "sidebar.dashboard.link"
  },
  {
    label: "Add Data",
    to: "/add-data",
    icon: CirclePlus,
    ocid: "sidebar.add-data.link"
  },
  {
    label: "Reports",
    to: "/reports",
    icon: ChartNoAxesColumn,
    ocid: "sidebar.reports.link"
  },
  {
    label: "Profile",
    to: "/profile",
    icon: User,
    ocid: "sidebar.profile.link"
  }
];
const adminNavItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
    ocid: "admin.sidebar.dashboard.link"
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: Users,
    ocid: "admin.sidebar.users.link"
  }
];
function Sidebar({ variant = "user" }) {
  const { location } = useRouterState();
  const items = variant === "admin" ? adminNavItems : userNavItems;
  const pathname = location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex h-full w-60 flex-col border-r border-border bg-card py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 font-display font-bold text-xl text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black", children: "G" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GlucoFit" })
      ] }),
      variant === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 pl-10 text-xs text-muted-foreground font-medium uppercase tracking-wider", children: "Admin Panel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-1 px-3 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground", children: variant === "admin" ? "Administration" : "Menu" }),
      items.map((item) => {
        const isActive = pathname === item.to || item.to !== "/dashboard" && item.to !== "/admin/dashboard" && pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            "data-ocid": item.ocid,
            className: cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                item.icon,
                {
                  className: cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              ),
              item.label,
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary" })
            ]
          },
          item.to
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: `© ${(/* @__PURE__ */ new Date()).getFullYear()} GlucoFit` }) })
  ] });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
export {
  AdminHeader as A,
  Badge as B,
  Card as C,
  Header as H,
  Sidebar as S,
  User as U,
  CardHeader as a,
  CardTitle as b,
  CardContent as c,
  ChartNoAxesColumn as d,
  Bell as e,
  ChevronDown as f
};
