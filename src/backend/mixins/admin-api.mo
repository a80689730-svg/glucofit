import AuthTypes "../types/auth";
import HealthTypes "../types/health";
import AdminTypes "../types/admin";
import AuthLib "../lib/auth";
import AdminLib "../lib/admin";
import HealthLib "../lib/health";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

mixin (
  users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
  sessions : Map.Map<Text, AuthTypes.Session>,
  glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
  weightEntries : List.List<HealthTypes.WeightEntry>
) {
  // Get all users with basic info and entry counts (admin only)
  public query func adminListUsers(
    token : Text
  ) : async AdminTypes.Result<[AdminTypes.UserSummary]> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        if (not AuthLib.isAdmin(users, userId)) {
          return #err("Admin access required");
        };
        #ok(AdminLib.listUsers(users, glucoseEntries, weightEntries))
      };
    }
  };

  // Get detailed profile + health entries for a specific user (admin only)
  public query func adminGetUserDetail(
    token : Text,
    userId : AuthTypes.UserId
  ) : async AdminTypes.Result<AdminTypes.UserDetail> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?callerId) {
        if (not AuthLib.isAdmin(users, callerId)) {
          return #err("Admin access required");
        };
        switch (users.get(userId)) {
          case null { #err("User not found") };
          case (?user) {
            let page = HealthLib.getEntriesForUser(glucoseEntries, weightEntries, userId, 0, 1000);
            #ok(AdminLib.toUserDetail(user, page.glucoseEntries, page.weightEntries))
          };
        }
      };
    }
  };
};
