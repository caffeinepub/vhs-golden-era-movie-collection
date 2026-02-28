import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let movies = Map.empty<Nat, Movie>();
  var nextId = 0;
  let ITEMS_PER_PAGE = 10;

  public type UserProfile = {
    name : Text;
  };
  let userProfiles = Map.empty<Principal, UserProfile>();

  type MovieId = Nat;
  public type Movie = {
    id : MovieId;
    title : Text;
    description : Text;
    photos : [Storage.ExternalBlob];
    genres : [Text];
    creator : Principal;
    createdAt : Time.Time;
  };

  public query ({ caller }) func backendHealthCheck() : async {
    message : Text;
    caller : Principal;
    timestamp : Time.Time;
  } {
    {
      message = "Backend health check successful";
      caller;
      timestamp = Time.now();
    };
  };

  public query ({ caller }) func getAuthStatus() : async { caller : Principal } {
    {
      caller = caller;
    };
  };

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

  public shared ({ caller }) func addMovie(
    title : Text,
    description : Text,
    photoBlobs : [Storage.ExternalBlob],
    genres : [Text],
  ) : async MovieId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add movies");
    };

    if (photoBlobs.size() > 3) {
      Runtime.trap("Cannot add more than 3 photos to one movie");
    };

    let movieId = nextId;
    nextId += 1;

    let movie : Movie = {
      id = movieId;
      title;
      description;
      photos = photoBlobs;
      genres;
      creator = caller;
      createdAt = Time.now();
    };

    movies.add(movieId, movie);
    movieId;
  };

  public shared ({ caller }) func deleteMovie(id : MovieId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete movies");
    };

    switch (movies.get(id)) {
      case (null) {
        Runtime.trap("Movie not found");
      };
      case (?movie) {
        if (movie.creator != caller) {
          Runtime.trap("Unauthorized: Only movie creator can delete this movie");
        };
        movies.remove(id);
      };
    };
  };

  public query ({ caller }) func getMovie(id : MovieId) : async {
    movie : ?Movie;
    isCreator : Bool;
  } {
    switch (movies.get(id)) {
      case (null) {
        { movie = null; isCreator = false };
      };
      case (?movie) {
        { movie = ?movie; isCreator = (movie.creator == caller) };
      };
    };
  };

  public query ({ caller }) func getMovies(page : Nat) : async [Movie] {
    let moviesArray = movies.values().toArray();
    let sortedMovies = moviesArray.sort(
      func(a, b) {
        if (a.createdAt < b.createdAt) { return #less };
        if (a.createdAt > b.createdAt) { return #greater };
        #equal;
      }
    );

    if (sortedMovies.size() < 1) { return [] };
    let start = page * ITEMS_PER_PAGE;
    if (start >= sortedMovies.size()) { return [] };
    let end = Nat.min(start + ITEMS_PER_PAGE, sortedMovies.size());
    sortedMovies.sliceToArray(start, end);
  };

  public query ({ caller }) func getAllGenres() : async [Text] {
    var genresSet = Map.empty<Text, ()>();
    for (movie in movies.values()) {
      for (genre in movie.genres.values()) {
        genresSet.add(genre, ());
      };
    };
    genresSet.keys().toArray();
  };

  public query ({ caller }) func filterByGenre(genre : Text) : async [Movie] {
    let filteredMovies = movies.filter(
      func(_id, movie) {
        movie.genres.any(func(g) { g == genre });
      }
    );
    filteredMovies.values().toArray();
  };

  public type PaginationInfo = {
    totalPages : Nat;
    itemsPerPage : Nat;
    totalItems : Nat;
  };

  public query ({ caller }) func getPaginationInfo() : async PaginationInfo {
    let totalItems = movies.size();
    let totalPages = if (totalItems == 0) {
      0;
    } else {
      (totalItems - 1) / ITEMS_PER_PAGE + 1;
    };

    {
      totalPages;
      itemsPerPage = ITEMS_PER_PAGE;
      totalItems;
    };
  };
};
