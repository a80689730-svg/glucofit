import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { PageLoader } from "./components/ui/LoadingSpinner";

// Lazy load pages
const HomePage = lazy(() =>
  import("./routes/index").then((m) => ({ default: m.HomePage })),
);
const LoginPage = lazy(() =>
  import("./routes/login").then((m) => ({ default: m.LoginPage })),
);
const SignupPage = lazy(() =>
  import("./routes/signup").then((m) => ({ default: m.SignupPage })),
);
const DashboardPage = lazy(() =>
  import("./routes/dashboard").then((m) => ({ default: m.DashboardPage })),
);
const AddDataPage = lazy(() =>
  import("./routes/add-data").then((m) => ({ default: m.AddDataPage })),
);
const ReportsPage = lazy(() =>
  import("./routes/reports").then((m) => ({ default: m.ReportsPage })),
);
const ProfilePage = lazy(() =>
  import("./routes/profile").then((m) => ({ default: m.ProfilePage })),
);
const AdminLoginPage = lazy(() =>
  import("./routes/admin/login").then((m) => ({ default: m.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import("./routes/admin/dashboard").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("./routes/admin/users").then((m) => ({ default: m.AdminUsersPage })),
);
const AdminUserDetailPage = lazy(() =>
  import("./routes/admin/users.$userId").then((m) => ({
    default: m.AdminUserDetailPage,
  })),
);

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster position="top-right" richColors />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => <SignupPage />,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <DashboardPage />,
});
const addDataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-data",
  component: () => <AddDataPage />,
});
const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => <ReportsPage />,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <ProfilePage />,
});
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: () => <AdminLoginPage />,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => <AdminDashboardPage />,
});
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: () => <AdminUsersPage />,
});
const adminUserDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users/$userId",
  component: () => <AdminUserDetailPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  addDataRoute,
  reportsRoute,
  profileRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminUserDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
