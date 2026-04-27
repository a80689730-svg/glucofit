import {
  apiGetUnreadNotificationCount,
  apiGetUnreadNotifications,
  apiMarkNotificationsRead,
  useBackendActor,
} from "@/api";
import type { Notification } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const { currentUser, sessionToken, logout } = useAuthStore();
  const { actor } = useBackendActor();
  const [notifCount, setNotifCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actor || !sessionToken) return;
    const fetchCount = async () => {
      try {
        const count = await apiGetUnreadNotificationCount(actor, sessionToken);
        setNotifCount(Number(count));
      } catch {
        // silent
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
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
          items.map((n) => n.id),
        );
        setNotifCount(0);
      }
    } catch {
      // silent
    }
  };

  const handleLogout = async () => {
    if (actor && sessionToken) {
      try {
        await actor.logout(sessionToken);
      } catch {
        /* silent */
      }
    }
    logout();
  };

  const initials = currentUser?.fullName
    ? currentUser.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
      <Link
        to="/"
        className="flex items-center gap-2.5 font-display font-bold text-xl text-primary"
        data-ocid="header.logo.link"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-sm font-black">G</span>
        </div>
        <span>GlucoFit</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleNotifOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
            aria-label="Notifications"
            data-ocid="header.notifications.button"
          >
            <Bell className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border bg-card shadow-lg"
              data-ocid="header.notifications.popover"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="font-semibold text-foreground text-sm">
                  Notifications
                </p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={String(n.id)}
                      className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0"
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${n.kind === "glucose" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}
                      >
                        {n.kind === "glucose" ? "G" : "W"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {n.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {n.kind === "glucose" ? "Glucose" : "Weight"}:{" "}
                          {n.value} {n.unit}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-smooth"
            data-ocid="header.user.dropdown"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:block max-w-[120px] truncate">
              {currentUser?.fullName ?? "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-border bg-card shadow-lg">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-t-xl transition-smooth"
                onClick={() => setDropdownOpen(false)}
                data-ocid="header.profile.link"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-b-xl transition-smooth"
                data-ocid="header.logout.button"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {(dropdownOpen || notifOpen) && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-30"
          onClick={() => {
            setDropdownOpen(false);
            setNotifOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDropdownOpen(false);
              setNotifOpen(false);
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close dropdowns"
        />
      )}
    </header>
  );
}

export function AdminHeader() {
  const { currentUser, sessionToken, logout } = useAuthStore();
  const { actor } = useBackendActor();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!actor || !sessionToken) return;
    const fetchCount = async () => {
      try {
        const count = await apiGetUnreadNotificationCount(actor, sessionToken);
        setNotifCount(Number(count));
      } catch {
        /* silent */
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [actor, sessionToken]);

  const handleLogout = async () => {
    if (actor && sessionToken) {
      try {
        await actor.logout(sessionToken);
      } catch {
        /* silent */
      }
    }
    logout();
  };

  const initials = currentUser?.fullName
    ? currentUser.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
      <div className="flex items-center gap-2.5 font-display font-bold text-xl text-primary">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-sm font-black">G</span>
        </div>
        <span>GlucoFit</span>
        <Badge className="ml-1 text-xs">Admin</Badge>
      </div>
      <div className="flex items-center gap-3">
        {notifCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
            <Bell className="h-4 w-4" />
            {notifCount} new
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {currentUser?.fullName ?? "Admin"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-destructive hover:bg-destructive/5 transition-smooth"
          data-ocid="admin.header.logout.button"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
