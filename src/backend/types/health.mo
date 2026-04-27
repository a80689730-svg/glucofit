import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type GlucoseUnit = { #mgdl; #mmoll };
  public type WeightUnit = { #kg; #lbs };

  public type EntryKind = { #glucose; #weight };

  // Glucose reading
  public type GlucoseEntry = {
    id : Nat;
    userId : UserId;
    value : Float;
    unit : GlucoseUnit;
    readingTime : Timestamp;
    notes : Text;
    createdAt : Timestamp;
  };

  // Weight entry
  public type WeightEntry = {
    id : Nat;
    userId : UserId;
    value : Float;
    unit : WeightUnit;
    recordedAt : Timestamp;
    notes : Text;
    createdAt : Timestamp;
  };

  // Unified health entry for admin views
  public type HealthEntry = {
    #glucose : GlucoseEntry;
    #weight : WeightEntry;
  };

  // Add glucose input
  public type AddGlucoseInput = {
    value : Float;
    unit : GlucoseUnit;
    readingTime : Timestamp;
    notes : Text;
  };

  // Add weight input
  public type AddWeightInput = {
    value : Float;
    unit : WeightUnit;
    recordedAt : Timestamp;
    notes : Text;
  };

  // Paginated health entries result
  public type HealthPage = {
    glucoseEntries : [GlucoseEntry];
    weightEntries : [WeightEntry];
    total : Nat;
    offset : Nat;
    limit : Nat;
  };

  public type Result<T> = { #ok : T; #err : Text };
};
