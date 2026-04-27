import Common "common";

module {
  public type UserId = Common.UserId;
  public type Role = Common.Role;
  public type Timestamp = Common.Timestamp;

  // Internal user record stored in canister state
  public type UserInternal = {
    id : UserId;
    email : Text;
    passwordHash : Text;
    fullName : Text;
    createdAt : Timestamp;
    role : Role;
  };

  // Public-facing user record (no password hash)
  public type User = {
    id : UserId;
    email : Text;
    fullName : Text;
    createdAt : Timestamp;
    role : Role;
  };

  // Session token record
  public type Session = {
    token : Text;
    userId : UserId;
    createdAt : Timestamp;
  };

  // Signup input
  public type SignupInput = {
    email : Text;
    password : Text;
    fullName : Text;
  };

  // Login input
  public type LoginInput = {
    email : Text;
    password : Text;
  };

  // Auth result returned on login/signup
  public type AuthResult = {
    #ok : { token : Text; user : User };
    #err : Text;
  };

  // Generic result
  public type Result<T> = { #ok : T; #err : Text };
};
