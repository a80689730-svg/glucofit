import { apiSignup, useBackendActor } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type FormFields = "fullName" | "email" | "password" | "confirm";

const fieldConfig: {
  field: FormFields;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  {
    field: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Sarah Johnson",
    autoComplete: "name",
  },
  {
    field: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    field: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 8 characters",
    autoComplete: "new-password",
  },
  {
    field: "confirm",
    label: "Confirm Password",
    type: "password",
    placeholder: "Repeat your password",
    autoComplete: "new-password",
  },
];

export function SignupPage() {
  const { setAuth, isAuthenticated: isAppAuthenticated } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const {
    login: iiLogin,
    isLoggingIn,
    isAuthenticated: isIIAuthenticated,
  } = useInternetIdentity();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState<Partial<Record<FormFields, boolean>>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Store pending form data to use after II authentication completes
  const pendingForm = useRef<{
    email: string;
    password: string;
    fullName: string;
  } | null>(null);

  // Once II auth succeeds and actor is ready, call backend signup
  const doBackendSignup = useCallback(
    async (
      backendActor: NonNullable<typeof actor>,
      data: { email: string; password: string; fullName: string },
    ) => {
      setSubmitError(null);
      try {
        const { user, token } = await apiSignup(
          backendActor,
          data.email,
          data.password,
          data.fullName,
        );
        setAuth(user, token);
        toast.success("Account created! Welcome to GlucoFit.");
        navigate({ to: "/dashboard" });
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
        pendingForm.current = null;
      }
    },
    [setAuth, navigate],
  );

  // Watch for actor to refresh after II authentication
  useEffect(() => {
    if (pendingForm.current && isIIAuthenticated && !isFetching && actor) {
      doBackendSignup(actor, pendingForm.current);
    }
  }, [isIIAuthenticated, isFetching, actor, doBackendSignup]);

  if (isAppAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const getError = (field: FormFields): string | null => {
    if (!touched[field]) return null;
    if (field === "fullName" && !form.fullName.trim())
      return "Full name is required";
    if (field === "email") {
      if (!form.email) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(form.email))
        return "Enter a valid email address";
    }
    if (field === "password") {
      if (!form.password) return "Password is required";
      if (form.password.length < 8)
        return "Password must be at least 8 characters";
    }
    if (field === "confirm" && touched.confirm) {
      if (!form.confirm) return "Please confirm your password";
      if (form.password !== form.confirm) return "Passwords don't match";
    }
    return null;
  };

  const validate = (): boolean => {
    const allTouched = {
      fullName: true,
      email: true,
      password: true,
      confirm: true,
    };
    setTouched(allTouched);
    if (!form.fullName.trim()) return false;
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return false;
    if (!form.password || form.password.length < 8) return false;
    if (form.password !== form.confirm) return false;
    return true;
  };

  const handleChange =
    (field: FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setSubmitError(null);
    };

  const handleBlur = (field: FormFields) =>
    setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError(null);

    // If already II-authenticated and actor is ready, call backend directly
    if (isIIAuthenticated && actor && !isFetching) {
      await doBackendSignup(actor, {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });
      return;
    }

    // Store form data and trigger II authentication
    pendingForm.current = {
      email: form.email,
      password: form.password,
      fullName: form.fullName,
    };
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
            Control Your Sugar, Own Your Life.
          </p>
          <div className="space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: "✅", label: "Free account, no credit card needed" },
              { icon: "🔒", label: "Your data is private and secure" },
              { icon: "📈", label: "Visualize trends with smart insights" },
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
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Start tracking your health with GlucoFit — it's free
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {fieldConfig.map(
                ({ field, label, type, placeholder, autoComplete }) => {
                  const error = getError(field);
                  const isPasswordField =
                    field === "password" || field === "confirm";
                  const showToggle = isPasswordField;
                  const showThisPassword =
                    field === "password" ? showPassword : showConfirm;

                  return (
                    <div key={field} className="space-y-1.5">
                      <Label
                        htmlFor={`signup-${field}`}
                        className="text-sm font-medium"
                      >
                        {label}
                      </Label>
                      <div className={showToggle ? "relative" : undefined}>
                        <Input
                          id={`signup-${field}`}
                          type={
                            isPasswordField
                              ? showThisPassword
                                ? "text"
                                : "password"
                              : type
                          }
                          placeholder={placeholder}
                          value={form[field]}
                          onChange={handleChange(field)}
                          onBlur={() => handleBlur(field)}
                          className={`${showToggle ? "pr-10" : ""} ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                          data-ocid={`signup.${field}.input`}
                          autoComplete={autoComplete}
                        />
                        {showToggle && (
                          <button
                            type="button"
                            onClick={() =>
                              field === "password"
                                ? setShowPassword((v) => !v)
                                : setShowConfirm((v) => !v)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showThisPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showThisPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                      {error && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid={`signup.${field}.field_error`}
                        >
                          {error}
                        </p>
                      )}
                    </div>
                  );
                },
              )}

              {submitError && (
                <div
                  className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                  role="alert"
                  data-ocid="signup.error_state"
                >
                  {submitError}
                </div>
              )}

              {/* II auth hint */}
              {!isIIAuthenticated && (
                <p className="text-xs text-muted-foreground text-center">
                  You'll be asked to authenticate with Internet Identity before
                  creating your account.
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-semibold transition-smooth"
                disabled={isSubmitting}
                data-ocid="signup.submit_button"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Authenticating...
                  </span>
                ) : loading || isFetching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                  data-ocid="signup.login.link"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground px-4">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
