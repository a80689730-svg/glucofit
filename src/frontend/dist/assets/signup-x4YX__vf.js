import { a as useInternetIdentity, u as useNavigate, r as reactExports, b as ue, j as jsxRuntimeExports, L as Link } from "./index-BSjU2GqU.js";
import { u as useBackendActor, b as apiSignup } from "./api-BZjA4YsM.js";
import { u as useAuthStore, B as Button } from "./createLucideIcon-Bj0p1aTc.js";
import { I as Input } from "./input-BhuIoUB-.js";
import { L as Label } from "./label-DW_rdHeY.js";
import { A as Activity } from "./activity-5DVtCZVZ.js";
import { E as EyeOff, a as Eye } from "./eye-CDGjIOHq.js";
const fieldConfig = [
  {
    field: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Sarah Johnson",
    autoComplete: "name"
  },
  {
    field: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email"
  },
  {
    field: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 8 characters",
    autoComplete: "new-password"
  },
  {
    field: "confirm",
    label: "Confirm Password",
    type: "password",
    placeholder: "Repeat your password",
    autoComplete: "new-password"
  }
];
function SignupPage() {
  const { setAuth, isAuthenticated: isAppAuthenticated } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const {
    login: iiLogin,
    isLoggingIn,
    isAuthenticated: isIIAuthenticated
  } = useInternetIdentity();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    fullName: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [touched, setTouched] = reactExports.useState(
    {}
  );
  const [loading, setLoading] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const pendingForm = reactExports.useRef(null);
  const doBackendSignup = reactExports.useCallback(
    async (backendActor, data) => {
      setSubmitError(null);
      try {
        const { user, token } = await apiSignup(
          backendActor,
          data.email,
          data.password,
          data.fullName
        );
        setAuth(user, token);
        ue.success("Account created! Welcome to GlucoFit.");
        navigate({ to: "/dashboard" });
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
        pendingForm.current = null;
      }
    },
    [setAuth, navigate]
  );
  reactExports.useEffect(() => {
    if (pendingForm.current && isIIAuthenticated && !isFetching && actor) {
      doBackendSignup(actor, pendingForm.current);
    }
  }, [isIIAuthenticated, isFetching, actor, doBackendSignup]);
  if (isAppAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }
  const getError = (field) => {
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
  const validate = () => {
    const allTouched = {
      fullName: true,
      email: true,
      password: true,
      confirm: true
    };
    setTouched(allTouched);
    if (!form.fullName.trim()) return false;
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return false;
    if (!form.password || form.password.length < 8) return false;
    if (form.password !== form.confirm) return false;
    return true;
  };
  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setSubmitError(null);
  };
  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError(null);
    if (isIIAuthenticated && actor && !isFetching) {
      await doBackendSignup(actor, {
        email: form.email,
        password: form.password,
        fullName: form.fullName
      });
      return;
    }
    pendingForm.current = {
      email: form.email,
      password: form.password,
      fullName: form.fullName
    };
    iiLogin();
  };
  const isSubmitting = loading || isLoggingIn || isFetching;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex md:w-5/12 lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary-foreground blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground/15 border border-primary-foreground/20 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-10 w-10 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-bold text-primary-foreground mb-3", children: "GlucoFit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-lg font-medium mb-10", children: "Control Your Sugar, Own Your Life." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 text-left max-w-xs mx-auto", children: [
          { icon: "✅", label: "Free account, no credit card needed" },
          { icon: "🔒", label: "Your data is private and secure" },
          { icon: "📈", label: "Visualize trends with smart insights" }
        ].map(({ icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 bg-primary-foreground/10 border border-primary-foreground/15 rounded-xl px-4 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground/90 text-sm font-medium", children: label })
            ]
          },
          label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center bg-background px-4 py-10 md:py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:hidden items-center justify-center gap-2 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-foreground", children: "GlucoFit" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground mb-1", children: "Create your account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Start tracking your health with GlucoFit — it's free" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
          fieldConfig.map(
            ({ field, label, type, placeholder, autoComplete }) => {
              const error = getError(field);
              const isPasswordField = field === "password" || field === "confirm";
              const showToggle = isPasswordField;
              const showThisPassword = field === "password" ? showPassword : showConfirm;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: `signup-${field}`,
                    className: "text-sm font-medium",
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: showToggle ? "relative" : void 0, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `signup-${field}`,
                      type: isPasswordField ? showThisPassword ? "text" : "password" : type,
                      placeholder,
                      value: form[field],
                      onChange: handleChange(field),
                      onBlur: () => handleBlur(field),
                      className: `${showToggle ? "pr-10" : ""} ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`,
                      "data-ocid": `signup.${field}.input`,
                      autoComplete
                    }
                  ),
                  showToggle && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => field === "password" ? setShowPassword((v) => !v) : setShowConfirm((v) => !v),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": showThisPassword ? "Hide password" : "Show password",
                      children: showThisPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive",
                    "data-ocid": `signup.${field}.field_error`,
                    children: error
                  }
                )
              ] }, field);
            }
          ),
          submitError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive",
              role: "alert",
              "data-ocid": "signup.error_state",
              children: submitError
            }
          ),
          !isIIAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "You'll be asked to authenticate with Internet Identity before creating your account." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full h-11 font-semibold transition-smooth",
              disabled: isSubmitting,
              "data-ocid": "signup.submit_button",
              children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" }),
                "Authenticating..."
              ] }) : loading || isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" }),
                "Creating Account..."
              ] }) : "Create Account"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-5 border-t border-border text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/login",
              className: "font-semibold text-primary hover:underline",
              "data-ocid": "signup.login.link",
              children: "Sign in"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-xs text-muted-foreground px-4", children: "By creating an account, you agree to our Terms of Service and Privacy Policy." })
    ] }) })
  ] });
}
export {
  SignupPage,
  SignupPage as default
};
