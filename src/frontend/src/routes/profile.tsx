import {
  apiGetMe,
  apiGetMyHealthEntries,
  apiLogout,
  useBackendActor,
} from "@/api";
import { Role } from "@/backend";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Lock,
  Mail,
  Save,
  Shield,
  User,
  Weight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(ts: bigint | undefined) {
  if (!ts) return "—";
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysSince(ts: bigint | undefined): number {
  if (!ts) return 0;
  const ms = Date.now() - Number(ts);
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

// ── stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold font-display text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { currentUser, sessionToken, logout, setAuth } = useAuthStore();
  const { actor } = useBackendActor();
  const navigate = useNavigate();

  const { isAuthenticated, isAdmin } = useAuthStore();

  // — profile edit —
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // — change password (not supported in this version) —
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changingPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess] = useState(false);

  // — delete account —
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // — logout —
  const [logoutLoading, setLogoutLoading] = useState(false);

  // — account stats pulled from backend —
  const [glucoseCount, setGlucoseCount] = useState<number | null>(null);
  const [weightCount, setWeightCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    } else if (isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch health entry counts for stats
  useEffect(() => {
    if (!actor || !sessionToken || !isAuthenticated) return;
    (async () => {
      try {
        const data = await apiGetMyHealthEntries(
          actor,
          sessionToken,
          BigInt(0),
          BigInt(999),
        );
        setGlucoseCount(data.glucoseEntries.length);
        setWeightCount(data.weightEntries.length);
      } catch {
        /* silent */
      }
    })();
  }, [actor, sessionToken, isAuthenticated]);

  if (!isAuthenticated || isAdmin) return null;

  const initials = currentUser?.fullName
    ? getInitials(currentUser.fullName)
    : "U";
  const memberSince = formatDate(currentUser?.createdAt);
  const memberDays = daysSince(currentUser?.createdAt);

  // — handlers —

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      // Refresh user data from backend to confirm identity
      if (actor && sessionToken) {
        const user = await apiGetMe(actor, sessionToken);
        setAuth(user, sessionToken);
      }
      setProfileSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (!currentPw) {
      setPwError("Current password is required");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match");
      return;
    }
    setPwError("Password change is not available in this version.");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    if (actor && sessionToken) {
      try {
        await apiLogout(actor, sessionToken);
      } catch {
        /* silent */
      }
    }
    logout();
    toast.success("Account deleted. Goodbye!");
    setDeleting(false);
    setDeleteOpen(false);
    navigate({ to: "/" });
  }

  async function handleLogout() {
    setLogoutLoading(true);
    if (actor && sessionToken) {
      try {
        await apiLogout(actor, sessionToken);
      } catch {
        /* silent */
      }
    }
    logout();
    toast.success("Signed out successfully");
    navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar variant="user" />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div
            className="mx-auto max-w-2xl px-4 py-8 sm:px-6"
            data-ocid="profile.page"
          >
            {/* ── Page heading ── */}
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account details and preferences
              </p>
            </div>

            {/* ── Profile header card ── */}
            <Card className="mb-6 shadow-sm" data-ocid="profile.header.card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div
                    className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold font-display shadow-md"
                    aria-label="User avatar"
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <h2 className="font-display text-xl font-bold text-foreground truncate">
                        {currentUser?.fullName ?? "—"}
                      </h2>
                      <Badge
                        variant={
                          currentUser?.role === Role.admin
                            ? "default"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {currentUser?.role === Role.admin
                          ? "Administrator"
                          : "Member"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {currentUser?.email ?? "—"}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Joined {memberSince}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Account stats ── */}
            <div
              className="mb-6 grid grid-cols-3 gap-3"
              data-ocid="profile.stats.section"
            >
              <StatCard
                icon={Activity}
                label="Glucose Readings"
                value={glucoseCount ?? "—"}
                color="bg-primary/10 text-primary"
              />
              <StatCard
                icon={Weight}
                label="Weight Entries"
                value={weightCount ?? "—"}
                color="bg-secondary/10 text-secondary"
              />
              <StatCard
                icon={Calendar}
                label="Days Active"
                value={memberDays}
                color="bg-accent/20 text-accent-foreground"
              />
            </div>

            {/* ── Edit profile ── */}
            <Card className="mb-6 shadow-sm" data-ocid="profile.edit.card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      data-ocid="profile.fullname.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={currentUser?.email ?? ""}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={savingProfile || !fullName.trim()}
                    className="gap-2 bg-primary hover:bg-primary/90"
                    data-ocid="profile.save.button"
                  >
                    {savingProfile ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Saving…
                      </span>
                    ) : profileSaved ? (
                      <span className="flex items-center gap-2 text-secondary">
                        <CheckCircle2 className="h-4 w-4" />
                        Saved!
                      </span>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ── Change password ── */}
            <Card className="mb-6 shadow-sm" data-ocid="profile.password.card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-primary" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPw">Current Password</Label>
                    <Input
                      id="currentPw"
                      type="password"
                      value={currentPw}
                      onChange={(e) => {
                        setCurrentPw(e.target.value);
                        setPwError("");
                      }}
                      placeholder="••••••••"
                      data-ocid="profile.current_password.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPw">New Password</Label>
                    <Input
                      id="newPw"
                      type="password"
                      value={newPw}
                      onChange={(e) => {
                        setNewPw(e.target.value);
                        setPwError("");
                      }}
                      placeholder="Min. 8 characters"
                      data-ocid="profile.new_password.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPw">Confirm New Password</Label>
                    <Input
                      id="confirmPw"
                      type="password"
                      value={confirmPw}
                      onChange={(e) => {
                        setConfirmPw(e.target.value);
                        setPwError("");
                      }}
                      placeholder="Repeat new password"
                      data-ocid="profile.confirm_password.input"
                    />
                  </div>

                  {pwError && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="profile.password.error_state"
                    >
                      {pwError}
                    </p>
                  )}
                  {pwSuccess && (
                    <p
                      className="flex items-center gap-1.5 text-sm text-secondary"
                      data-ocid="profile.password.success_state"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Password updated successfully!
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={changingPw}
                    className="gap-2 bg-primary hover:bg-primary/90"
                    data-ocid="profile.update_password.button"
                  >
                    {changingPw ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Updating…
                      </span>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ── Danger zone ── */}
            <Card
              className="mb-6 border-destructive/40 shadow-sm"
              data-ocid="profile.danger.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-foreground">
                    Delete Account
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={() => setDeleteOpen(true)}
                    data-ocid="profile.delete_account.open_modal_button"
                  >
                    Delete Account
                  </Button>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Sign out of your GlucoFit account on this device.
                  </p>
                  <Button
                    variant="outline"
                    disabled={logoutLoading}
                    onClick={handleLogout}
                    data-ocid="profile.logout.button"
                  >
                    {logoutLoading ? "Signing Out…" : "Sign Out"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* ── Delete confirmation modal ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-ocid="profile.delete.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This will
              permanently remove all your glucose readings, weight entries, and
              profile data. <strong>This cannot be undone.</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
              data-ocid="profile.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
              data-ocid="profile.delete.confirm_button"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                  Deleting…
                </span>
              ) : (
                "Yes, Delete My Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
