import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, P as PageLoader, L as Link } from "./index-BSjU2GqU.js";
import { u as useBackendActor, c as useQuery, j as apiAdminListUsers } from "./api-BZjA4YsM.js";
import { S as Sidebar, A as AdminHeader, B as Badge, C as Card, a as CardHeader, c as CardContent } from "./card-BSNiUgki.js";
import { E as EmptyState } from "./index-DMthdcVC.js";
import { c as createLucideIcon, u as useAuthStore, B as Button } from "./createLucideIcon-Bj0p1aTc.js";
import { I as Input } from "./input-BhuIoUB-.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, A as ArrowUpDown } from "./select-DW4jkKry.js";
import { U as Users } from "./users-D1zWgAno.js";
import "./index-eh6lQ3eo.js";
import "./Combination-DHwPIYSH.js";
import "./index-CU0NOAA_.js";
import "./index-CxzDhOcH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function UserRow({
  user,
  index
}) {
  const initials = user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const joinDate = new Date(Number(user.createdAt)).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/admin/users/$userId",
      params: { userId: String(user.id) },
      className: "flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group",
      "data-ocid": `admin.users.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold", children: initials }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: user.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Joined ",
            joinDate
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex items-center justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
            String(user.entryCount),
            " entries"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs sm:hidden", children: String(user.entryCount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 text-muted-foreground group-hover:text-foreground",
              asChild: true,
              "data-ocid": `admin.users.view.button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
            }
          )
        ] })
      ]
    }
  );
}
function AdminUsersPage() {
  const { isAuthenticated, isAdmin, sessionToken } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("date");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      return apiAdminListUsers(actor, sessionToken);
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchInterval: 3e4
  });
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    const list = (users ?? []).filter(
      (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.fullName.localeCompare(b.fullName);
      } else if (sortKey === "date") {
        cmp = Number(a.createdAt) - Number(b.createdAt);
      } else if (sortKey === "entries") {
        cmp = Number(a.entryCount) - Number(b.entryCount);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [users, search, sortKey, sortDir]);
  if (!isAuthenticated) {
    navigate({ to: "/admin/login" });
    return null;
  }
  if (!isAdmin) {
    navigate({ to: "/dashboard" });
    return null;
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { variant: "admin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminHeader, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { variant: "admin" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin.users.page", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage and view all registered users" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-sm w-fit", children: [
            (users == null ? void 0 : users.length) ?? 0,
            " total users"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by name or email...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-10",
                "data-ocid": "admin.users.search.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground hidden sm:block", children: "Sort by:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: sortKey,
                onValueChange: (v) => setSortKey(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-36 h-9 text-sm",
                      "data-ocid": "admin.users.sort.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name", children: "Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "date", children: "Join Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "entries", children: "Entries" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "h-9 w-9 shrink-0",
                onClick: () => setSortDir((d) => d === "asc" ? "desc" : "asc"),
                "aria-label": `Sort ${sortDir === "asc" ? "descending" : "ascending"}`,
                "data-ocid": "admin.users.sort-dir.toggle",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Users,
            title: search ? "No users found" : "No users yet",
            description: search ? `No users match "${search}"` : "Users who sign up will appear here",
            "data-ocid": "admin.users.empty_state"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin.users.table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:grid grid-cols-3 gap-4 px-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "justify-start text-xs font-semibold uppercase tracking-wider text-muted-foreground h-auto px-0 py-0",
                onClick: () => handleSort("name"),
                "data-ocid": "admin.users.sort-name.button",
                children: [
                  "Name",
                  sortKey === "name" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "ml-1 h-3 w-3" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "justify-start text-xs font-semibold uppercase tracking-wider text-muted-foreground h-auto px-0 py-0",
                onClick: () => handleSort("date"),
                "data-ocid": "admin.users.sort-date.button",
                children: [
                  "Join Date",
                  sortKey === "date" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "ml-1 h-3 w-3" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "justify-end text-xs font-semibold uppercase tracking-wider text-muted-foreground h-auto px-0 py-0",
                onClick: () => handleSort("entries"),
                "data-ocid": "admin.users.sort-entries.button",
                children: [
                  "Entries",
                  sortKey === "entries" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "ml-1 h-3 w-3" })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: filtered.map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserRow, { user, index: i }, String(user.id))) }) })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminUsersPage,
  AdminUsersPage as default
};
