import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import List "mo:core/List";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type MovieId = Nat;

  type Movie = {
    id : MovieId;
    title : Text;
    description : Text;
    photos : [Storage.ExternalBlob];
    genres : [Text];
    creator : Principal;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module Movie {
    public func compareByTitle(a : Movie, b : Movie) : Order.Order {
      Text.compare(a.title, b.title);
    };

    public func compareById(a : Movie, b : Movie) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareByCreatedAt(a : Movie, b : Movie) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  let ITEMS_PER_PAGE = 10;
  var nextId = 0;

  var movies = Map.empty<MovieId, Movie>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getAuthStatus() : async { caller : Principal } {
    {
      caller = caller;
    };
  };

  // User profile management
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

  // Add movie, only authenticated users
  public shared ({ caller }) func addMovie(
    title : Text,
    description : Text,
    photoBlobs : [Storage.ExternalBlob],
    genres : [Text],
  ) : async MovieId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add movies");
    };

    if (photoBlobs.size() > 3) {
      Runtime.trap("Cannot add more than 3 photos to one movie");
    };

    let movieId = nextId;
    nextId += 1;

    let newMovie : Movie = {
      id = movieId;
      title;
      description;
      photos = photoBlobs;
      genres;
      creator = caller;
      createdAt = Time.now();
    };

    movies.add(movieId, newMovie);
    movieId;
  };

  // Only authenticated users can delete, and only movie creator can delete their movie
  public shared ({ caller }) func deleteMovie(id : MovieId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
    let moviesList = movies.values().toArray().sort(Movie.compareByCreatedAt);
    if (moviesList.size() < 1) { return [] };
    let startIndex = page * ITEMS_PER_PAGE;
    if (startIndex >= moviesList.size()) { return [] };
    let endIndex = Nat.min(startIndex + ITEMS_PER_PAGE, moviesList.size());
    moviesList.sliceToArray(startIndex, endIndex);
  };

  public query ({ caller }) func filterByGenre(genre : Text) : async [Movie] {
    let filtered = List.empty<Movie>();
    for (movie in movies.values()) {
      for (g in movie.genres.values()) {
        if (g == genre) {
          filtered.add(movie);
        };
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getAllGenres() : async [Text] {
    let genresSet = Map.empty<Text, ()>();
    for (movie in movies.values()) {
      for (genre in movie.genres.values()) {
        genresSet.add(genre, ());
      };
    };
    genresSet.keys().toArray();
  };
};
