import HealthTypes "../types/health";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  // Build a new GlucoseEntry
  public func newGlucoseEntry(
    id : Nat,
    userId : HealthTypes.UserId,
    input : HealthTypes.AddGlucoseInput,
    createdAt : HealthTypes.Timestamp
  ) : HealthTypes.GlucoseEntry {
    {
      id;
      userId;
      value = input.value;
      unit = input.unit;
      readingTime = input.readingTime;
      notes = input.notes;
      createdAt;
    }
  };

  // Build a new WeightEntry
  public func newWeightEntry(
    id : Nat,
    userId : HealthTypes.UserId,
    input : HealthTypes.AddWeightInput,
    createdAt : HealthTypes.Timestamp
  ) : HealthTypes.WeightEntry {
    {
      id;
      userId;
      value = input.value;
      unit = input.unit;
      recordedAt = input.recordedAt;
      notes = input.notes;
      createdAt;
    }
  };

  // Return paginated health entries for a specific user (newest first)
  public func getUserGlucoseEntries(
    glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
    userId : HealthTypes.UserId,
    offset : Nat,
    limit : Nat
  ) : HealthTypes.HealthPage {
    let userGlucose = glucoseEntries
      .filter(func(e : HealthTypes.GlucoseEntry) : Bool { Principal.equal(e.userId, userId) })
      .reverse()
      .toArray();
    let total = userGlucose.size();
    let sliced = if (offset >= total) {
      []
    } else {
      let toEx = if (offset + limit > total) total else offset + limit;
      userGlucose.sliceToArray(offset, toEx)
    };
    { glucoseEntries = sliced; weightEntries = []; total; offset; limit }
  };

  // Return paginated weight entries for a specific user (newest first)
  public func getUserWeightEntries(
    weightEntries : List.List<HealthTypes.WeightEntry>,
    userId : HealthTypes.UserId,
    offset : Nat,
    limit : Nat
  ) : HealthTypes.HealthPage {
    let userWeight = weightEntries
      .filter(func(e : HealthTypes.WeightEntry) : Bool { Principal.equal(e.userId, userId) })
      .reverse()
      .toArray();
    let total = userWeight.size();
    let sliced = if (offset >= total) {
      []
    } else {
      let toEx = if (offset + limit > total) total else offset + limit;
      userWeight.sliceToArray(offset, toEx)
    };
    { glucoseEntries = []; weightEntries = sliced; total; offset; limit }
  };

  // Return all health entries across all users (admin)
  public func getAllEntries(
    glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
    weightEntries : List.List<HealthTypes.WeightEntry>,
    offset : Nat,
    limit : Nat
  ) : HealthTypes.HealthPage {
    let allGlucose = glucoseEntries.reverse().toArray();
    let allWeight = weightEntries.reverse().toArray();
    let totalGlucose = allGlucose.size();
    let totalWeight = allWeight.size();
    let total = totalGlucose + totalWeight;

    let slicedGlucose = if (offset >= totalGlucose) {
      []
    } else {
      let toEx = if (offset + limit > totalGlucose) totalGlucose else offset + limit;
      allGlucose.sliceToArray(offset, toEx)
    };
    let slicedWeight = if (offset >= totalWeight) {
      []
    } else {
      let toEx = if (offset + limit > totalWeight) totalWeight else offset + limit;
      allWeight.sliceToArray(offset, toEx)
    };
    { glucoseEntries = slicedGlucose; weightEntries = slicedWeight; total; offset; limit }
  };

  // Return health entries for a specific user (admin)
  public func getEntriesForUser(
    glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
    weightEntries : List.List<HealthTypes.WeightEntry>,
    userId : HealthTypes.UserId,
    offset : Nat,
    limit : Nat
  ) : HealthTypes.HealthPage {
    let userGlucose = glucoseEntries
      .filter(func(e : HealthTypes.GlucoseEntry) : Bool { Principal.equal(e.userId, userId) })
      .reverse()
      .toArray();
    let userWeight = weightEntries
      .filter(func(e : HealthTypes.WeightEntry) : Bool { Principal.equal(e.userId, userId) })
      .reverse()
      .toArray();
    let totalGlucose = userGlucose.size();
    let totalWeight = userWeight.size();
    let total = totalGlucose + totalWeight;

    let slicedGlucose = if (offset >= totalGlucose) {
      []
    } else {
      let toEx = if (offset + limit > totalGlucose) totalGlucose else offset + limit;
      userGlucose.sliceToArray(offset, toEx)
    };
    let slicedWeight = if (offset >= totalWeight) {
      []
    } else {
      let toEx = if (offset + limit > totalWeight) totalWeight else offset + limit;
      userWeight.sliceToArray(offset, toEx)
    };
    { glucoseEntries = slicedGlucose; weightEntries = slicedWeight; total; offset; limit }
  };

  // Count total health entries for a user
  public func countUserEntries(
    glucoseEntries : List.List<HealthTypes.GlucoseEntry>,
    weightEntries : List.List<HealthTypes.WeightEntry>,
    userId : HealthTypes.UserId
  ) : Nat {
    let gCount = glucoseEntries.filter(func(e : HealthTypes.GlucoseEntry) : Bool { Principal.equal(e.userId, userId) }).size();
    let wCount = weightEntries.filter(func(e : HealthTypes.WeightEntry) : Bool { Principal.equal(e.userId, userId) }).size();
    gCount + wCount
  };

  // Convert GlucoseUnit to display string
  public func glucoseUnitText(unit : HealthTypes.GlucoseUnit) : Text {
    switch (unit) {
      case (#mgdl) "mg/dL";
      case (#mmoll) "mmol/L";
    }
  };

  // Convert WeightUnit to display string
  public func weightUnitText(unit : HealthTypes.WeightUnit) : Text {
    switch (unit) {
      case (#kg) "kg";
      case (#lbs) "lbs";
    }
  };
};
