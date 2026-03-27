import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Bool "mo:core/Bool";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Profile = {
    name : Text;
    handle : Text;
    bio : Text;
    avatarUrl : Text;
  };

  type Link = {
    id : Nat;
    title : Text;
    url : Text;
    icon : Text;
    enabled : Bool;
  };

  module Link {
    public func compare(link1 : Link, link2 : Link) : Order.Order {
      Nat.compare(link1.id, link2.id);
    };
  };

  var linkOrder : [Nat] = [0, 1, 2, 3];

  let links = Map.fromIter<Nat, Link>(
    [
      (0, { id = 0; title = "Instagram"; url = "https://instagram.com/yourhandle"; icon = "📷"; enabled = true }),
      (1, { id = 1; title = "YouTube"; url = "https://youtube.com/@yourhandle"; icon = "🎥"; enabled = true }),
      (2, { id = 2; title = "Personal Website"; url = "https://yourwebsite.com"; icon = "🌐"; enabled = true }),
      (3, { id = 3; title = "Discord"; url = "https://discord.gg/yourhandle"; icon = "💬"; enabled = true }),
    ].values(),
  );

  var profile : Profile = {
    name = "Your Name";
    handle = "@yourhandle";
    bio = "Welcome to my page!";
    avatarUrl = "https://yourwebsite.com/avatar.png";
  };

  var nextLinkId = 4;

  public query ({ caller }) func getProfile() : async Profile {
    profile;
  };

  public query ({ caller }) func getLinks() : async [Link] {
    linkOrder.values().map(
      func(id) {
        switch (links.get(id)) {
          case (?link) { link };
          case (null) { Runtime.trap("Link does not exist") };
        };
      }
    ).toArray().filter(func(link) { link.enabled });
  };

  public shared ({ caller }) func updateProfile(newProfile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the profile");
    };
    profile := newProfile;
  };

  public shared ({ caller }) func addLink(title : Text, url : Text, icon : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add links");
    };
    let id = nextLinkId;
    let link : Link = { id; title; url; icon; enabled = true };
    links.add(id, link);
    linkOrder := linkOrder.concat([id]);
    nextLinkId += 1;
    id;
  };

  public shared ({ caller }) func updateLink(id : Nat, title : Text, url : Text, icon : Text, enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update links");
    };
    switch (links.get(id)) {
      case (?existingLink) {
        let updatedLink : Link = {
          id;
          title;
          url;
          icon;
          enabled;
        };
        links.add(id, updatedLink);
      };
      case (null) { Runtime.trap("Link does not exist") };
    };
  };

  public shared ({ caller }) func removeLink(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove links");
    };
    links.remove(id);
    linkOrder := linkOrder.filter(func(linkId) { linkId != id });
  };

  public shared ({ caller }) func reorderLinks(newOrder : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reorder links");
    };
    linkOrder := newOrder;
  };
};
