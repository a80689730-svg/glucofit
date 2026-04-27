import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Heart,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const features = [
  {
    icon: Heart,
    title: "Glucose Tracking",
    desc: "Log blood sugar readings with timestamps and meal context. Get instant status — Normal, High, or Low — at a glance.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Activity,
    title: "Weight Monitoring",
    desc: "Record daily weight and track your body trends over weeks and months with detailed visual history.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: BarChart3,
    title: "Health Reports",
    desc: "Interactive charts and AI-powered insights that help you understand your personal health patterns over time.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Admin Monitoring",
    desc: "Clinic staff get a full overview dashboard with user summaries, alerts, and real-time notifications for all patients.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

const stats = [
  { value: "10K+", label: "Active Users", icon: Users },
  { value: "500K+", label: "Readings Tracked", icon: TrendingUp },
  { value: "99.9%", label: "Uptime", icon: Zap },
  { value: "4.9★", label: "User Rating", icon: Star },
];

const testimonials = [
  {
    name: "Sarah L.",
    role: "Type 2 Diabetic",
    quote:
      "GlucoFit has completely transformed how I manage my health. I can see my glucose trends daily and my doctor is impressed.",
    initials: "SL",
    color: "bg-primary",
  },
  {
    name: "Dr. Ahmed K.",
    role: "Endocrinologist",
    quote:
      "I recommend GlucoFit to all my patients. The admin dashboard gives me real-time visibility into every patient's readings.",
    initials: "AK",
    color: "bg-secondary",
  },
  {
    name: "Maria T.",
    role: "Fitness Enthusiast",
    quote:
      "Tracking my weight alongside my glucose levels helped me find the diet and exercise balance that works perfectly for me.",
    initials: "MT",
    color: "bg-primary",
  },
];

const benefits = [
  "Free to start — no credit card required",
  "Works on any device, browser or mobile",
  "Data encrypted and stored securely",
  "Admin dashboard included",
];

export function HomePage() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: isAdmin ? "/admin/dashboard" : "/dashboard" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Navigation ─────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md shadow-sm"
        data-ocid="home.nav"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-foreground">
                GlucoFit
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                Track Smart. Live Better.
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="home.nav.features.link"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="home.nav.testimonials.link"
            >
              Testimonials
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="home.nav.login.link"
            >
              Login
            </Link>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                data-ocid="home.nav.login.button"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" data-ocid="home.nav.signup.button">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-background"
        data-ocid="home.hero.section"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary/6 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                Your Daily Health Companion
              </div>

              <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-6xl">
                Take Control of{" "}
                <span className="text-primary">Your Health</span>
                <br />
                with GlucoFit
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">
                Track your glucose, monitor your weight, and stay fit — all in
                one beautifully designed app. Get real-time insights and
                personalized health reports.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="shadow-md hover:shadow-lg transition-smooth font-semibold"
                    data-ocid="home.hero.get-started.button"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-semibold"
                    data-ocid="home.hero.login.button"
                  >
                    Login
                  </Button>
                </Link>
              </div>

              {/* Inline mini-stats */}
              <div className="flex items-center gap-8 pt-1">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "500K+", label: "Readings" },
                  { value: "99.9%", label: "Uptime" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="font-display text-2xl font-bold text-primary">
                      {s.value}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — dashboard preview card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              {/* Floating badge — top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 top-12 z-10 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/15">
                  <Activity className="h-4 w-4 text-secondary" />
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">STABLE</p>
                  <p className="text-xs text-muted-foreground">Weight trend</p>
                </div>
              </motion.div>

              {/* Floating badge — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="absolute -right-4 bottom-16 z-10 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                  <Heart className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">98 mg/dL</p>
                  <p className="text-xs text-muted-foreground">NORMAL range</p>
                </div>
              </motion.div>

              {/* Main card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-foreground">
                      Today's Summary
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-secondary">
                    On Track
                  </span>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Blood Glucose
                    </p>
                    <p className="font-display text-4xl font-extrabold text-primary leading-none">
                      98
                    </p>
                    <p className="mb-2 text-xs text-muted-foreground">mg/dL</p>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary/15 px-2 py-0.5 text-xs font-bold text-secondary">
                      <CheckCircle2 className="h-3 w-3" />
                      NORMAL
                    </span>
                  </div>
                  <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Body Weight
                    </p>
                    <p className="font-display text-4xl font-extrabold text-secondary leading-none">
                      72
                    </p>
                    <p className="mb-2 text-xs text-muted-foreground">kg</p>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary/15 px-2 py-0.5 text-xs font-bold text-secondary">
                      <TrendingUp className="h-3 w-3" />
                      STABLE
                    </span>
                  </div>
                </div>

                {/* Mini chart */}
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Glucose — Last 7 Days
                    </p>
                    <p className="text-xs text-muted-foreground">mg/dL</p>
                  </div>
                  <div className="flex h-20 items-end gap-1.5">
                    {[
                      { h: 62, label: "M" },
                      { h: 78, label: "T" },
                      { h: 68, label: "W" },
                      { h: 85, label: "T" },
                      { h: 72, label: "F" },
                      { h: 65, label: "S" },
                      { h: 75, label: "S" },
                    ].map((bar) => (
                      <div
                        key={`${bar.label}-${bar.h}`}
                        className="flex flex-1 flex-col items-center gap-1"
                      >
                        <div
                          className="w-full rounded-t-sm bg-primary/60 hover:bg-primary transition-colors"
                          style={{ height: `${bar.h}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Strip ────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-display text-3xl font-extrabold text-foreground">
                  {s.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section
        id="features"
        className="bg-background py-20"
        data-ocid="home.features.section"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full border border-primary/25 bg-primary/8 px-4 py-1 text-sm font-semibold text-primary">
              Everything You Need
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Built for Your Health Journey
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
              Powerful features designed for people managing diabetes and
              fitness goals.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-smooth"
                data-ocid={`home.feature.item.${i + 1}`}
              >
                <div
                  className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl ${f.bg} transition-smooth group-hover:scale-110`}
                >
                  <f.icon className={`h-7 w-7 ${f.color}`} />
                </div>
                <h3 className="mb-2 font-display font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────── */}
      <section
        id="testimonials"
        className="bg-muted/30 py-20"
        data-ocid="home.testimonials.section"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">
              Loved by Patients & Doctors
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Real Stories, Real Impact
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Thousands trust GlucoFit to manage their health every day.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                data-ocid={`home.testimonial.item.${i + 1}`}
              >
                <div className="mb-4 flex gap-0.5">
                  {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                    <Star
                      key={k}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-primary-foreground`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-primary py-20"
        data-ocid="home.cta.section"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/8 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-extrabold text-primary-foreground">
              Start Your Health Journey Today
            </h2>
            <p className="mt-3 text-lg text-primary-foreground/80">
              Join thousands of users who trust GlucoFit to manage their health.
              Free to start — no credit card required.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {benefits.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-1.5 text-sm text-primary-foreground/90"
                >
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  {b}
                </div>
              ))}
            </div>

            <Link to="/signup" className="mt-8 inline-block">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold shadow-lg hover:shadow-xl transition-smooth"
                data-ocid="home.cta.signup.button"
              >
                Create Free Account
              </Button>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-2 hover:text-primary-foreground transition-colors"
                data-ocid="home.cta.login.link"
              >
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-display text-lg font-bold text-foreground">
                  GlucoFit
                </p>
                <p className="text-xs text-muted-foreground">
                  Track Smart. Live Better.
                </p>
              </div>
            </div>

            {/* Footer nav */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
              <Link
                to="/login"
                className="hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-foreground transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/admin/login"
                className="hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GlucoFit. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
