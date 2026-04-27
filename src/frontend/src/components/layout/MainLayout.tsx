import { useAuthStore } from "@/store/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    } else if (isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || isAdmin) return null;

  return <>{children}</>;
}
