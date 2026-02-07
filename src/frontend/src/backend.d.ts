import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Movie {
    id: MovieId;
    title: string;
    creator: Principal;
    createdAt: Time;
    description: string;
    genres: Array<string>;
    photos: Array<ExternalBlob>;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export type MovieId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMovie(title: string, description: string, photoBlobs: Array<ExternalBlob>, genres: Array<string>): Promise<MovieId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMovie(id: MovieId): Promise<void>;
    filterByGenre(genre: string): Promise<Array<Movie>>;
    getAllGenres(): Promise<Array<string>>;
    getAuthStatus(): Promise<{
        caller: Principal;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMovie(id: MovieId): Promise<{
        movie?: Movie;
        isCreator: boolean;
    }>;
    getMovies(page: bigint): Promise<Array<Movie>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
