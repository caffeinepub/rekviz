import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Profile {
    bio: string;
    name: string;
    avatarUrl: string;
    handle: string;
}
export interface Link {
    id: bigint;
    url: string;
    title: string;
    icon: string;
    enabled: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLink(title: string, url: string, icon: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLinks(): Promise<Array<Link>>;
    getProfile(): Promise<Profile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeLink(id: bigint): Promise<void>;
    reorderLinks(newOrder: Array<bigint>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLink(id: bigint, title: string, url: string, icon: string, enabled: boolean): Promise<void>;
    updateProfile(newProfile: Profile): Promise<void>;
}
