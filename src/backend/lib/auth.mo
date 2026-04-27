import AuthTypes "../types/auth";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Hash a password (deterministic hash using text encoding)
  public func hashPassword(password : Text) : Text {
    // Simple deterministic hash: encode characters as hex-like representation
    let bytes = password.encodeUtf8();
    let blob = bytes;
    // Use debug_show for a stable text representation of the blob
    "hash:" # debug_show(blob)
  };

  // Verify a password against a stored hash
  public func verifyPassword(password : Text, hash : Text) : Bool {
    hashPassword(password) == hash
  };

  // Generate a session token from userId and timestamp
  public func generateToken(userId : AuthTypes.UserId, now : AuthTypes.Timestamp) : Text {
    "tok:" # userId.toText() # ":" # debug_show(now)
  };

  // Find a user by email in the users map
  public func findByEmail(
    users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
    email : Text
  ) : ?AuthTypes.UserInternal {
    var result : ?AuthTypes.UserInternal = null;
    label search for ((_, user) in users.entries()) {
      if (user.email == email) {
        result := ?user;
        break search;
      };
    };
    result
  };

  // Create a new UserInternal record
  public func newUser(
    id : AuthTypes.UserId,
    input : AuthTypes.SignupInput,
    createdAt : AuthTypes.Timestamp,
    role : AuthTypes.Role
  ) : AuthTypes.UserInternal {
    {
      id;
      email = input.email;
      passwordHash = hashPassword(input.password);
      fullName = input.fullName;
      createdAt;
      role;
    }
  };

  // Strip password hash to return public User
  public func toPublic(user : AuthTypes.UserInternal) : AuthTypes.User {
    {
      id = user.id;
      email = user.email;
      fullName = user.fullName;
      createdAt = user.createdAt;
      role = user.role;
    }
  };

  // Resolve session token to userId
  public func resolveSession(
    sessions : Map.Map<Text, AuthTypes.Session>,
    token : Text
  ) : ?AuthTypes.UserId {
    switch (sessions.get(token)) {
      case (?session) ?session.userId;
      case null null;
    }
  };

  // Check whether a user stored in the map has admin role
  public func isAdmin(
    users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
    userId : AuthTypes.UserId
  ) : Bool {
    switch (users.get(userId)) {
      case (?(user)) {
        switch (user.role) {
          case (#admin) true;
          case (#user) false;
        }
      };
      case null false;
    }
  };

  // Upsert the hardcoded admin user by email.
  // If a user with that email already exists, update their passwordHash and role to #admin.
  // If no user exists with that email, create one using the anonymous principal as a placeholder id.
  public func upsertAdmin(
    users : Map.Map<AuthTypes.UserId, AuthTypes.UserInternal>,
    email : Text,
    password : Text,
    fullName : Text
  ) {
    let pwHash = hashPassword(password);
    let now = Time.now();
    // Search for an existing user with this email
    var existingId : ?AuthTypes.UserId = null;
    label search for ((uid, u) in users.entries()) {
      if (u.email == email) {
        existingId := ?uid;
        break search;
      };
    };
    switch (existingId) {
      case (?uid) {
        // Update existing user: reset password and ensure admin role
        switch (users.get(uid)) {
          case (?existing) {
            users.add(uid, { existing with passwordHash = pwHash; role = #admin });
          };
          case null {};
        };
      };
      case null {
        // Create a new admin user with a deterministic principal derived from the email bytes
        let adminId = email.encodeUtf8().fromBlob();
        let newAdmin : AuthTypes.UserInternal = {
          id = adminId;
          email;
          passwordHash = pwHash;
          fullName;
          createdAt = now;
          role = #admin;
        };
        users.add(adminId, newAdmin);
      };
    };
  };
};
