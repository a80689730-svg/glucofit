import { apiLogin, useBackendActor } from "@/api";
import { Role } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function AdminLoginPage() {
  const {
    setAuth,
    isAuthenticated: isAppAuthenticated,
    isAdmin,
  } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const {
    login: iiLogin,
    isLoggingIn,
    isAuthenticated: isIIAuthenticated,
  } = useInternetIdentity();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Store pending credentials to use after II authentication completes
  const pendingCredentials = useRef<{ email: string; password: string } | null>(
    null,
  );

  // Once II auth succeeds and actor is ready, call backend login
  const doBackendLogin = useCallback(
    async (
      backendActor: NonNullable<typeof actor>,
      credentials: { email: string; password: string },
    ) => {
      setSubmitError(null);
      try {
        const { user, token } = await apiLogin(
          backendActor,
          credentials.email,
          credentials.password,
        );
        if (user.role !== Role.admin) {
          setSubmitError(
            "This account does not have administrator access. Please use the regular login.",
          );
          return;
        }
        setAuth(user, token);
        toast.success("Welcome, Admin! You're now signed in.");
        navigate({ to: "/admin/dashboard" });
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Invalid credentials. Please try again.",
        );
      } finally {
        setLoading(false);
        pendingCredentials.current = null;
      }
    },
    [setAuth, navigate],
  );

  // Watch for actor to refresh after II authentication
  useEffect(() => {
    if (
      pendingCredentials.current &&
      isIIAuthenticated &&
      !isFetching &&
      actor
    ) {
      doBackendLogin(actor, pendingCredentials.current);
    }
  }, [isIIAuthenticated, isFetching, actor, doBackendLogin]);

  if (isAppAuthenticated && isAdmin) {
    navigate({ to: "/admin/dashboard" });
    return null;
  }

  const emailError =
    touched.email && !email
      ? "Email is required"
      : touched.email && !/\S+@\S+\.\S+/.test(email)
        ? "Enter a valid email address"
        : null;

  const passwordError =
    touched.password && !password ? "Password is required" : null;

  const handleBlur = (field: "email" | "password") =>
    setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const hasErrors = !email || !/\S+@\S+\.\S+/.test(email) || !password;
    if (hasErrors) return;

    setLoading(true);
    setSubmitError(null);

    // If already II-authenticated and actor is ready, call backend directly
    if (isIIAuthenticated && actor && !isFetching) {
      await doBackendLogin(actor, { email, password });
      return;
    }

    // Store credentials and trigger II authentication
    pendingCredentials.current = { email, password };
    iiLogin();
  };

  const isSubmitting = loading || isLoggingIn || isFetching;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo & heading */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground text-background mb-4 shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Restricted access · Administrator credentials required
          </p>
        </div>

        {/* Security notice badge */}
        <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-secondary" />
          <span>This portal is for GlucoFit administrators only</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-sm font-medium">
                Admin Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@glucofit.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubmitError(null);
                }}
                onBlur={() => handleBlur("email")}
                className={
                  emailError
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : ""
                }
                data-ocid="admin.login.email.input"
                autoComplete="email"
              />
              {emailError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.login.email.field_error"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSubmitError(null);
                  }}
                  onBlur={() => handleBlur("password")}
                  className={`pr-10 ${passwordError ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  data-ocid="admin.login.password.input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-ocid="admin.login.password.toggle"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.login.password.field_error"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submission / role error */}
            {submitError && (
              <div
                className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                role="alert"
                data-ocid="admin.login.error_state"
              >
                {submitError}
              </div>
            )}

            {/* II auth hint */}
            {!isIIAuthenticated && (
              <p className="text-xs text-muted-foreground text-center">
                You'll be asked to authenticate with Internet Identity before
                accessing the admin portal.
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold bg-foreground text-background hover:bg-foreground/90 transition-smooth"
              disabled={isSubmitting}
              data-ocid="admin.login.submit_button"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Authenticating...
                </span>
              ) : loading || isFetching ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Verifying Access...
                </span>
              ) : (
                "Sign In as Administrator"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Not an administrator?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
                data-ocid="admin.login.user.link"
              >
                Go to User Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
