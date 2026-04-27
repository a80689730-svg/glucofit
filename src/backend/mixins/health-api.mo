import AuthTypes "../types/auth";
import HealthTypes "../types/health";
import AuthLib "../lib/auth";
import HealthLib "../lib/health";
import NotifLib "../lib/notifications";
import NotifTypes "../types/notifications";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (
  users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
  sessions : Map.Map<Text, AuthTypes.Session>,
  glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
  weightEntries : List.List<HealthTypes.WeightEntry>,
  notifications : List.List<NotifTypes.Notification>
) {
  var nextGlucoseId : Nat = 0;
  var nextWeightId : Nat = 0;
  var nextHealthNotifId : Nat = 0;

  // Add a glucose reading for the authenticated user
  public shared func addGlucoseEntry(
    token : Text,
    input : HealthTypes.AddGlucoseInput
  ) : async HealthTypes.Result<HealthTypes.GlucoseEntry> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        let now = Time.now();
        let entry = HealthLib.newGlucoseEntry(nextGlucoseId, userId, input, now);
        glucoseEntries.add(entry);
        nextGlucoseId += 1;
        let userName = switch (users.get(userId)) {
          case (?u) u.fullName;
          case null userId.toText();
        };
        let unitText = HealthLib.glucoseUnitText(input.unit);
        let notif = NotifLib.newGlucoseNotification(nextHealthNotifId, userId, userName, input.value, unitText, now);
        notifications.add(notif);
        nextHealthNotifId += 1;
        #ok(entry)
      };
    }
  };

  // Add a weight entry for the authenticated user
  public shared func addWeightEntry(
    token : Text,
    input : HealthTypes.AddWeightInput
  ) : async HealthTypes.Result<HealthTypes.WeightEntry> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        let now = Time.now();
        let entry = HealthLib.newWeightEntry(nextWeightId, userId, input, now);
        weightEntries.add(entry);
        nextWeightId += 1;
        let userName = switch (users.get(userId)) {
          case (?u) u.fullName;
          case null userId.toText();
        };
        let unitText = HealthLib.weightUnitText(input.unit);
        let notif = NotifLib.newWeightNotification(nextHealthNotifId, userId, userName, input.value, unitText, now);
        notifications.add(notif);
        nextHealthNotifId += 1;
        #ok(entry)
      };
    }
  };

  // Get authenticated user's own health entries (paginated, newest first)
  public query func getMyHealthEntries(
    token : Text,
    offset : Nat,
    limit : Nat
  ) : async HealthTypes.Result<HealthTypes.HealthPage> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        let glucosePage = HealthLib.getUserGlucoseEntries(glucoseEntries, userId, offset, limit);
        let weightPage = HealthLib.getUserWeightEntries(weightEntries, userId, offset, limit);
        let total = glucosePage.total + weightPage.total;
        #ok({
          glucoseEntries = glucosePage.glucoseEntries;
          weightEntries = weightPage.weightEntries;
          total;
          offset;
          limit;
        })
      };
    }
  };

  // Get all users' health entries (admin only)
  public query func getAllHealthEntries(
    token : Text,
    offset : Nat,
    limit : Nat
  ) : async HealthTypes.Result<HealthTypes.HealthPage> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        if (not AuthLib.isAdmin(users, userId)) {
          return #err("Admin access required");
        };
        #ok(HealthLib.getAllEntries(glucoseEntries, weightEntries, offset, limit))
      };
    }
  };

  // Get health entries for a specific user (admin only)
  public query func getUserHealthEntries(
    token : Text,
    userId : AuthTypes.UserId,
    offset : Nat,
    limit : Nat
  ) : async HealthTypes.Result<HealthTypes.HealthPage> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?callerId) {
        if (not AuthLib.isAdmin(users, callerId)) {
          return #err("Admin access required");
        };
        #ok(HealthLib.getEntriesForUser(glucoseEntries, weightEntries, userId, offset, limit))
      };
    }
  };
};
