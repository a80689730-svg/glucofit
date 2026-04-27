import { apiLogin, useBackendActor } from "@/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function LoginPage() {
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
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Store pending credentials to use after II authentication completes
  const pendingCredentials = useRef<{ email: string; password: string } | null>(
    null,
  );

  // Once II auth succeeds and actor is ready with authenticated identity, call backend
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
        setAuth(user, token);
        toast.success(`Welcome back! You're signed in.`);
        navigate({
          to: user.role === "admin" ? "/admin/dashboard" : "/dashboard",
        });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Invalid email or password";
        setSubmitError(msg);
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

  if (isAppAuthenticated) {
    navigate({ to: isAdmin ? "/admin/dashboard" : "/dashboard" });
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

  const isFormValid = !emailError && !passwordError && email && password;

  const handleBlur = (field: "email" | "password") =>
    setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel — branding */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground/15 border border-primary-foreground/20 mb-6">
            <Activity className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-3">
            GlucoFit
          </h1>
          <p className="text-primary-foreground/80 text-lg font-medium mb-10">
            Track Smart. Live Better.
          </p>
          <div className="space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: "📊", label: "Monitor glucose levels in real time" },
              { icon: "⚖️", label: "Track weight and health trends" },
              { icon: "🔔", label: "Instant alerts for abnormal readings" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-primary-foreground/10 border border-primary-foreground/15 rounded-xl px-4 py-3"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-primary-foreground/90 text-sm font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-10 md:py-0">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              GlucoFit
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-1">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to your GlucoFit account
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
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
                  data-ocid="login.email.input"
                  autoComplete="email"
                />
                {emailError && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="login.email.field_error"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setSubmitError(null);
                    }}
                    onBlur={() => handleBlur("password")}
                    className={`pr-10 ${passwordError ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                    data-ocid="login.password.input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    data-ocid="login.password.toggle"
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
                    data-ocid="login.password.field_error"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  data-ocid="login.remember_me.checkbox"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submission error */}
              {submitError && (
                <div
                  className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                  role="alert"
                  data-ocid="login.error_state"
                >
                  {submitError}
                </div>
              )}

              {/* II auth hint */}
              {!isIIAuthenticated && (
                <p className="text-xs text-muted-foreground text-center">
                  You'll be asked to authenticate with Internet Identity before
                  signing in.
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-semibold transition-smooth"
                disabled={isSubmitting}
                data-ocid="login.submit_button"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Authenticating...
                  </span>
                ) : loading || isFetching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary hover:underline"
                  data-ocid="login.signup.link"
                >
                  Create one for free
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Administrator?{" "}
                <Link
                  to="/admin/login"
                  className="font-semibold text-primary hover:underline"
                  data-ocid="login.admin.link"
                >
                  Admin Login →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
