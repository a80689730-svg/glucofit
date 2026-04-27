import AuthTypes "../types/auth";
import HealthTypes "../types/health";
import AdminTypes "../types/admin";
import HealthLib "health";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

module {
  // Build a UserSummary from internal user + entry count
  public func toUserSummary(
    user : AuthTypes.UserInternal,
    entryCount : Nat
  ) : AdminTypes.UserSummary {
    {
      id = user.id;
      email = user.email;
      fullName = user.fullName;
      createdAt = user.createdAt;
      entryCount;
    }
  };

  // Build a UserDetail from internal user + their health entries
  public func toUserDetail(
    user : AuthTypes.UserInternal,
    glucoseEntries : [HealthTypes.GlucoseEntry],
    weightEntries : [HealthTypes.WeightEntry]
  ) : AdminTypes.UserDetail {
    {
      id = user.id;
      email = user.email;
      fullName = user.fullName;
      createdAt = user.createdAt;
      glucoseEntries;
      weightEntries;
    }
  };

  // Collect all users as summaries with entry counts
  public func listUsers(
    users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
    glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
    weightEntries : List.List<HealthTypes.WeightEntry>
  ) : [AdminTypes.UserSummary] {
    let summaries = List.empty<AdminTypes.UserSummary>();
    for ((_, user) in users.entries()) {
      let count = HealthLib.countUserEntries(glucoseEntries, weightEntries, user.id);
      summaries.add(toUserSummary(user, count));
    };
    summaries.toArray()
  };
};
