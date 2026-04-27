import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  LayoutDashboard,
  PlusCircle,
  User,
  Users,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  ocid: string;
}

const userNavItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    ocid: "sidebar.dashboard.link",
  },
  {
    label: "Add Data",
    to: "/add-data",
    icon: PlusCircle,
    ocid: "sidebar.add-data.link",
  },
  {
    label: "Reports",
    to: "/reports",
    icon: BarChart2,
    ocid: "sidebar.reports.link",
  },
  {
    label: "Profile",
    to: "/profile",
    icon: User,
    ocid: "sidebar.profile.link",
  },
];

const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
    ocid: "admin.sidebar.dashboard.link",
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: Users,
    ocid: "admin.sidebar.users.link",
  },
];

interface SidebarProps {
  variant?: "user" | "admin";
}

export function Sidebar({ variant = "user" }: SidebarProps) {
  const { location } = useRouterState();
  const items = variant === "admin" ? adminNavItems : userNavItems;
  const pathname = location.pathname;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card py-6">
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5 font-display font-bold text-xl text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-black">G</span>
          </div>
          <span>GlucoFit</span>
        </div>
        {variant === "admin" && (
          <p className="mt-1 pl-10 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Admin Panel
          </p>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {variant === "admin" ? "Administration" : "Menu"}
        </p>
        {items.map((item) => {
          const isActive =
            pathname === item.to ||
            (item.to !== "/dashboard" &&
              item.to !== "/admin/dashboard" &&
              pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={item.ocid}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 mt-auto">
        <p className="text-xs text-muted-foreground">
          {`© ${new Date().getFullYear()} GlucoFit`}
        </p>
      </div>
    </aside>
  );
}
