import AuthTypes "types/auth";
import HealthTypes "types/health";
import NotifTypes "types/notifications";
import AuthLib "lib/auth";
import Map "mo:core/Map";
import List "mo:core/List";

import AuthApi "mixins/auth-api";
import HealthApi "mixins/health-api";
import NotificationsApi "mixins/notifications-api";
import AdminApi "mixins/admin-api";

actor {
  // --- Shared state ---
  let users = Map.empty<AuthTypes.UserId, AuthTypes.UserInternal>();
  let sessions = Map.empty<Text, AuthTypes.Session>();

  let glucoseEntries = List.empty<HealthTypes.GlucoseEntry>();
  let weightEntries = List.empty<HealthTypes.WeightEntry>();

  let notifications = List.empty<NotifTypes.Notification>();

  // Tracks whether the hardcoded admin has been seeded at least once
  let adminSeeded = { var value = false };

  // Seed the hardcoded admin at actor initialization time (inline)
  AuthLib.upsertAdmin(users, "namratakutwade@gmail.com", "Charlie", "Admin");
  adminSeeded.value := true;

  // --- Mixins ---
  include AuthApi(users, sessions, adminSeeded);
  include HealthApi(users, sessions, glucoseEntries, weightEntries, notifications);
  include NotificationsApi(users, sessions, notifications);
  include AdminApi(users, sessions, glucoseEntries, weightEntries);
};
