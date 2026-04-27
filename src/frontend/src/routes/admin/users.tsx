import { apiAdminListUsers, useBackendActor } from "@/api";
import type { UserSummary } from "@/backend";
import { AdminHeader } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpDown, ChevronRight, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

type SortKey = "name" | "date" | "entries";
type SortDir = "asc" | "desc";

function UserRow({
  user,
  index,
}: {
  user: UserSummary;
  index: number;
}) {
  const initials = user.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = new Date(Number(user.createdAt)).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <Link
      to="/admin/users/$userId"
      params={{ userId: String(user.id) }}
      className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group"
      data-ocid={`admin.users.item.${index + 1}`}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">
        {initials}
      </div>
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <div className="hidden sm:flex items-center">
          <p className="text-xs text-muted-foreground">Joined {joinDate}</p>
        </div>
        <div className="hidden sm:flex items-center justify-end">
          <Badge variant="outline" className="text-xs">
            {String(user.entryCount)} entries
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs sm:hidden">
          {String(user.entryCount)}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground group-hover:text-foreground"
          asChild
          data-ocid={`admin.users.view.button.${index + 1}`}
        >
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </Link>
  );
}

export function AdminUsersPage() {
  const { isAuthenticated, isAdmin, sessionToken } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      return apiAdminListUsers(actor, sessionToken);
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    refetchInterval: 30_000,
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = (users ?? []).filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
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
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden md:flex">
          <Sidebar variant="admin" />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto max-w-6xl px-6 py-8">
              <PageLoader />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="admin" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="space-y-6" data-ocid="admin.users.page">
              {/* Page header */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Users
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage and view all registered users
                  </p>
                </div>
                <Badge variant="outline" className="text-sm w-fit">
                  {users?.length ?? 0} total users
                </Badge>
              </div>

              {/* Search + sort controls */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                    data-ocid="admin.users.search.input"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Sort by:
                  </span>
                  <Select
                    value={sortKey}
                    onValueChange={(v) => setSortKey(v as SortKey)}
                  >
                    <SelectTrigger
                      className="w-36 h-9 text-sm"
                      data-ocid="admin.users.sort.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Join Date</SelectItem>
                      <SelectItem value="entries">Entries</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() =>
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                    }
                    aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
                    data-ocid="admin.users.sort-dir.toggle"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Table / Empty state */}
              {filtered.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title={search ? "No users found" : "No users yet"}
                  description={
                    search
                      ? `No users match "${search}"`
                      : "Users who sign up will appear here"
                  }
                  data-ocid="admin.users.empty_state"
                />
              ) : (
                <Card data-ocid="admin.users.table">
                  <CardHeader className="pb-0">
                    <div className="hidden sm:grid grid-cols-3 gap-4 px-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs font-semibold uppercase tracking-wider text-muted-foreground h-auto px-0 py-0"
                        onClick={() => handleSort("name")}
                        data-ocid="admin.users.sort-name.button"
                      >
                        Name
                        {sortKey === "name" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs font-semibold uppercase tracking-wider text-muted-foreground h-auto px-0 py-0"
                        onClick={() => handleSort("date")}
                        data-ocid="admin.users.sort-date.button"
                      >
                        Join Date
                        {sortKey === "date" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-end text-xs font-semibold uppercase tracking-wider text-muted-foreground h-auto px-0 py-0"
                        onClick={() => handleSort("entries")}
                        data-ocid="admin.users.sort-entries.button"
                      >
                        Entries
                        {sortKey === "entries" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <div className="divide-y divide-border">
                      {filtered.map((user, i) => (
                        <UserRow key={String(user.id)} user={user} index={i} />
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

export default AdminUsersPage;
