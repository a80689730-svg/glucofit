import NotifTypes "../types/notifications";
import List "mo:core/List";

module {
  // Create a notification when a glucose entry is added
  public func newGlucoseNotification(
    id : Nat,
    userId : NotifTypes.UserId,
    userName : Text,
    value : Float,
    unit : Text,
    timestamp : NotifTypes.Timestamp
  ) : NotifTypes.Notification {
    {
      id;
      kind = #glucose;
      userId;
      userName;
      value;
      unit;
      timestamp;
      isRead = false;
    }
  };

  // Create a notification when a weight entry is added
  public func newWeightNotification(
    id : Nat,
    userId : NotifTypes.UserId,
    userName : Text,
    value : Float,
    unit : Text,
    timestamp : NotifTypes.Timestamp
  ) : NotifTypes.Notification {
    {
      id;
      kind = #weight;
      userId;
      userName;
      value;
      unit;
      timestamp;
      isRead = false;
    }
  };

  // Get all unread notifications (newest first)
  public func getUnread(
    notifications : List.List<NotifTypes.Notification>
  ) : [NotifTypes.Notification] {
    notifications
      .filter(func(n : NotifTypes.Notification) : Bool { not n.isRead })
      .reverse()
      .toArray()
  };

  // Count unread notifications
  public func countUnread(
    notifications : List.List<NotifTypes.Notification>
  ) : Nat {
    notifications
      .filter(func(n : NotifTypes.Notification) : Bool { not n.isRead })
      .size()
  };

  // Mark a single notification as read (returns updated notification)
  public func markRead(notif : NotifTypes.Notification) : NotifTypes.Notification {
    { notif with isRead = true }
  };
};
