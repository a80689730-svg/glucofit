import Common "common";
import Health "health";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // User summary for admin list view
  public type UserSummary = {
    id : UserId;
    email : Text;
    fullName : Text;
    createdAt : Timestamp;
    entryCount : Nat;
  };

  // Detailed user profile with health entries for admin
  public type UserDetail = {
    id : UserId;
    email : Text;
    fullName : Text;
    createdAt : Timestamp;
    glucoseEntries : [Health.GlucoseEntry];
    weightEntries : [Health.WeightEntry];
  };

  public type Result<T> = { #ok : T; #err : Text };
};
