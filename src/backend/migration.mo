import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldMovie = {
    id : Nat;
    title : Text;
    description : Text;
    photos : [Storage.ExternalBlob];
    genres : [Text];
    createdAt : Time.Time;
  };

  type OldActor = {
    movies : Map.Map<Nat, OldMovie>;
    nextId : Nat;
  };

  type UserProfile = {
    name : Text;
  };

  type NewMovie = {
    id : Nat;
    title : Text;
    description : Text;
    photos : [Storage.ExternalBlob];
    genres : [Text];
    creator : Principal;
    createdAt : Time.Time;
  };

  type NewActor = {
    movies : Map.Map<Nat, NewMovie>;
    nextId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newMovies = old.movies.map<Nat, OldMovie, NewMovie>(
      func(_id, oldMovie) {
        { oldMovie with creator = Principal.anonymous() };
      }
    );
    {
      movies = newMovies;
      nextId = old.nextId;
      userProfiles = Map.empty<Principal, UserProfile>();
    };
  };
};
