import AuthTypes "../types/auth";
import AuthLib "../lib/auth";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (
  users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
  sessions : Map.Map<Text, AuthTypes.Session>,
  adminSeeded : { var value : Bool }
) {
  // Register a new user account
  public shared ({ caller }) func signup(
    input : AuthTypes.SignupInput
  ) : async AuthTypes.AuthResult {
    // Reject anonymous callers
    if (caller.isAnonymous()) {
      return #err("Anonymous caller not allowed");
    };
    // Check email uniqueness
    switch (AuthLib.findByEmail(users, input.email)) {
      case (?_) { return #err("Email already registered") };
      case null {};
    };
    // First user becomes admin (bootstrap)
    let role : AuthTypes.Role = if (users.isEmpty()) { #admin } else { #user };
    let now = Time.now();
    let user = AuthLib.newUser(caller, input, now, role);
    users.add(caller, user);
    let token = AuthLib.generateToken(caller, now);
    let session : AuthTypes.Session = { token; userId = caller; createdAt = now };
    sessions.add(token, session);
    #ok({ token; user = AuthLib.toPublic(user) })
  };

  // Login with email + password, returns session token
  public shared func login(
    input : AuthTypes.LoginInput
  ) : async AuthTypes.AuthResult {
    let userOpt = AuthLib.findByEmail(users, input.email);
    switch (userOpt) {
      case null { #err("Invalid email or password") };
      case (?user) {
        if (not AuthLib.verifyPassword(input.password, user.passwordHash)) {
          return #err("Invalid email or password");
        };
        let now = Time.now();
        let token = AuthLib.generateToken(user.id, now);
        let session : AuthTypes.Session = { token; userId = user.id; createdAt = now };
        sessions.add(token, session);
        #ok({ token; user = AuthLib.toPublic(user) })
      };
    }
  };

  // Get current authenticated user info from session token
  public query func getMe(token : Text) : async AuthTypes.Result<AuthTypes.User> {
    switch (AuthLib.resolveSession(sessions, token)) {
      case null { #err("Invalid or expired session") };
      case (?userId) {
        switch (users.get(userId)) {
          case null { #err("User not found") };
          case (?user) { #ok(AuthLib.toPublic(user)) };
        }
      };
    }
  };

  // Logout and invalidate session token
  public shared func logout(token : Text) : async () {
    sessions.remove(token);
  };

  // Check if caller principal has admin role
  public query ({ caller }) func isAdmin() : async Bool {
    AuthLib.isAdmin(users, caller)
  };

  // Seed/reset the hardcoded admin account.
  // Safe to call multiple times — always ensures the admin exists with the configured credentials.
  public shared func initAdmin() : async Text {
    AuthLib.upsertAdmin(users, "namratakutwade@gmail.com", "Charlie", "Admin");
    adminSeeded.value := true;
    "Admin account initialized"
  };

  // Alias for initAdmin — callable for recovery purposes
  public shared func resetAdmin() : async Text {
    AuthLib.upsertAdmin(users, "namratakutwade@gmail.com", "Charlie", "Admin");
    adminSeeded.value := true;
    "Admin account reset"
  };
};
