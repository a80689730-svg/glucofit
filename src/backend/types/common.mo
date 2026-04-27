import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type Timestamp = Time.Time; // Int (nanoseconds)

  public type Role = { #user; #admin };

  public type Page<T> = {
    items : [T];
    total : Nat;
    offset : Nat;
    limit : Nat;
  };
};
