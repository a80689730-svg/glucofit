import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type NotificationKind = { #glucose; #weight };

  public type Notification = {
    id : Nat;
    kind : NotificationKind;
    userId : UserId;
    userName : Text;
    value : Float;
    unit : Text;
    timestamp : Timestamp;
    isRead : Bool;
  };

  public type Result<T> = { #ok : T; #err : Text };
};
