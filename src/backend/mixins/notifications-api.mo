import AuthTypes "../types/auth";
import NotifTypes "../types/notifications";
import AuthLib "../lib/auth";
import NotifLib "../lib/notifications";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
  sessions : Map.Map<Text, AuthTypes.Session>,
  notifications : List.List<NotifTypes.Notification>
) {
  // Get all unread notifications (admin only, used for polling)
  public query func getUnreadNotifications(
    token : Text
  ) : async NotifTypes.Result<[NotifTypes.Notification]> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        if (not AuthLib.isAdmin(users, userId)) {
          return #err("Admin access required");
        };
        #ok(NotifLib.getUnread(notifications))
      };
    }
  };

  // Get count of unread notifications (admin only)
  public query func getUnreadNotificationCount(
    token : Text
  ) : async NotifTypes.Result<Nat> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        if (not AuthLib.isAdmin(users, userId)) {
          return #err("Admin access required");
        };
        #ok(NotifLib.countUnread(notifications))
      };
    }
  };

  // Mark a list of notifications as read (admin only)
  public shared func markNotificationsRead(
    token : Text,
    ids : [Nat]
  ) : async NotifTypes.Result<()> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        if (not AuthLib.isAdmin(users, userId)) {
          return #err("Admin access required");
        };
        notifications.mapInPlace(func(n : NotifTypes.Notification) : NotifTypes.Notification {
          let isTarget = ids.find(func(id : Nat) : Bool { id == n.id }) != null;
          if (isTarget) { NotifLib.markRead(n) } else { n }
        });
        #ok(())
      };
    }
  };
};
