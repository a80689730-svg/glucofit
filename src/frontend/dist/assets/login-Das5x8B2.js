import { a as useInternetIdentity, u as useNavigate, r as reactExports, b as ue, j as jsxRuntimeExports, L as Link } from "./index-BSjU2GqU.js";
import { u as useBackendActor, a as apiLogin } from "./api-BZjA4YsM.js";
import { c as createLucideIcon, u as useAuthStore, R as Role, B as Button } from "./createLucideIcon-Bj0p1aTc.js";
import { I as Input } from "./input-BhuIoUB-.js";
import { L as Label } from "./label-DW_rdHeY.js";
import { E as EyeOff, a as Eye } from "./eye-CDGjIOHq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function AdminLoginPage() {
  const {
    setAuth,
    isAuthenticated: isAppAuthenticated,
    isAdmin
  } = useAuthStore();
  const { actor, isFetching } = useBackendActor();
  const {
    login: iiLogin,
    isLoggingIn,
    isAuthenticated: isIIAuthenticated
  } = useInternetIdentity();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [touched, setTouched] = reactExports.useState({ email: false, password: false });
  const [submitError, setSubmitError] = reactExports.useState(null);
  const pendingCredentials = reactExports.useRef(
    null
  );
  const doBackendLogin = reactExports.useCallback(
    async (backendActor, credentials) => {
      setSubmitError(null);
      try {
        const { user, token } = await apiLogin(
          backendActor,
          credentials.email,
          credentials.password
        );
        if (user.role !== Role.admin) {
          setSubmitError(
            "This account does not have administrator access. Please use the regular login."
          );
          return;
        }
        setAuth(user, token);
        ue.success("Welcome, Admin! You're now signed in.");
        navigate({ to: "/admin/dashboard" });
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Invalid credentials. Please try again."
        );
      } finally {
        setLoading(false);
        pendingCredentials.current = null;
      }
    },
    [setAuth, navigate]
  );
  reactExports.useEffect(() => {
    if (pendingCredentials.current && isIIAuthenticated && !isFetching && actor) {
      doBackendLogin(actor, pendingCredentials.current);
    }
  }, [isIIAuthenticated, isFetching, actor, doBackendLogin]);
  if (isAppAuthenticated && isAdmin) {
    navigate({ to: "/admin/dashboard" });
    return null;
  }
  const emailError = touched.email && !email ? "Email is required" : touched.email && !/\S+@\S+\.\S+/.test(email) ? "Enter a valid email address" : null;
  const passwordError = touched.password && !password ? "Password is required" : null;
  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const hasErrors = !email || !/\S+@\S+\.\S+/.test(email) || !password;
    if (hasErrors) return;
    setLoading(true);
    setSubmitError(null);
    if (isIIAuthenticated && actor && !isFetching) {
      await doBackendLogin(actor, { email, password });
      return;
    }
    pendingCredentials.current = { email, password };
    iiLogin();
  };
  const isSubmitting = loading || isLoggingIn || isFetching;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-muted/30 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground text-background mb-4 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Portal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: "Restricted access · Administrator credentials required" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 text-secondary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This portal is for GlucoFit administrators only" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-email", className: "text-sm font-medium", children: "Admin Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "admin-email",
              type: "email",
              placeholder: "admin@glucofit.com",
              value: email,
              onChange: (e) => {
                setEmail(e.target.value);
                setSubmitError(null);
              },
              onBlur: () => handleBlur("email"),
              className: emailError ? "border-destructive focus-visible:ring-destructive/30" : "",
              "data-ocid": "admin.login.email.input",
              autoComplete: "email"
            }
          ),
          emailError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.login.email.field_error",
              children: emailError
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-password", className: "text-sm font-medium", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "admin-password",
                type: showPassword ? "text" : "password",
                placeholder: "Your admin password",
                value: password,
                onChange: (e) => {
                  setPassword(e.target.value);
                  setSubmitError(null);
                },
                onBlur: () => handleBlur("password"),
                className: `pr-10 ${passwordError ? "border-destructive focus-visible:ring-destructive/30" : ""}`,
                "data-ocid": "admin.login.password.input",
                autoComplete: "current-password"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword((v) => !v),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": showPassword ? "Hide password" : "Show password",
                "data-ocid": "admin.login.password.toggle",
                children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] }),
          passwordError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.login.password.field_error",
              children: passwordError
            }
          )
        ] }),
        submitError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive",
            role: "alert",
            "data-ocid": "admin.login.error_state",
            children: submitError
          }
        ),
        !isIIAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "You'll be asked to authenticate with Internet Identity before accessing the admin portal." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full h-11 font-semibold bg-foreground text-background hover:bg-foreground/90 transition-smooth",
            disabled: isSubmitting,
            "data-ocid": "admin.login.submit_button",
            children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" }),
              "Authenticating..."
            ] }) : loading || isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" }),
              "Verifying Access..."
            ] }) : "Sign In as Administrator"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-5 border-t border-border text-center space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Not an administrator?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            className: "font-semibold text-primary hover:underline",
            "data-ocid": "admin.login.user.link",
            children: "Go to User Login"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: "Unauthorized access attempts are logged and monitored." })
  ] }) });
}
export {
  AdminLoginPage,
  AdminLoginPage as default
};
