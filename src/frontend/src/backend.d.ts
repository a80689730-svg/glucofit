import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoginInput {
    password: string;
    email: string;
}
export type Timestamp = bigint;
export type Result__1_1 = {
    __kind__: "ok";
    ok: WeightEntry;
} | {
    __kind__: "err";
    err: string;
};
export type Result_2 = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export type Result__3 = {
    __kind__: "ok";
    ok: Array<UserSummary>;
} | {
    __kind__: "err";
    err: string;
};
export interface User {
    id: UserId;
    createdAt: Timestamp;
    role: Role;
    fullName: string;
    email: string;
}
export type Result__1 = {
    __kind__: "ok";
    ok: HealthPage;
} | {
    __kind__: "err";
    err: string;
};
export type Result__3_1 = {
    __kind__: "ok";
    ok: UserDetail;
} | {
    __kind__: "err";
    err: string;
};
export type Result_1 = {
    __kind__: "ok";
    ok: Array<Notification>;
} | {
    __kind__: "err";
    err: string;
};
export interface HealthPage {
    total: bigint;
    offset: bigint;
    limit: bigint;
    weightEntries: Array<WeightEntry>;
    glucoseEntries: Array<GlucoseEntry>;
}
export interface GlucoseEntry {
    id: bigint;
    readingTime: Timestamp;
    value: number;
    userId: UserId;
    createdAt: Timestamp;
    unit: GlucoseUnit;
    notes: string;
}
export type UserId = Principal;
export interface UserDetail {
    id: UserId;
    createdAt: Timestamp;
    fullName: string;
    email: string;
    weightEntries: Array<WeightEntry>;
    glucoseEntries: Array<GlucoseEntry>;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface AddWeightInput {
    value: number;
    unit: WeightUnit;
    recordedAt: Timestamp;
    notes: string;
}
export interface UserSummary {
    id: UserId;
    entryCount: bigint;
    createdAt: Timestamp;
    fullName: string;
    email: string;
}
export type Result__2 = {
    __kind__: "ok";
    ok: User;
} | {
    __kind__: "err";
    err: string;
};
export type Result__1_2 = {
    __kind__: "ok";
    ok: GlucoseEntry;
} | {
    __kind__: "err";
    err: string;
};
export interface Notification {
    id: bigint;
    userName: string;
    value: number;
    userId: UserId;
    kind: NotificationKind;
    unit: string;
    isRead: boolean;
    timestamp: Timestamp;
}
export type AuthResult = {
    __kind__: "ok";
    ok: {
        token: string;
        user: User;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface WeightEntry {
    id: bigint;
    value: number;
    userId: UserId;
    createdAt: Timestamp;
    unit: WeightUnit;
    recordedAt: Timestamp;
    notes: string;
}
export interface AddGlucoseInput {
    readingTime: Timestamp;
    value: number;
    unit: GlucoseUnit;
    notes: string;
}
export interface SignupInput {
    password: string;
    fullName: string;
    email: string;
}
export enum GlucoseUnit {
    mmoll = "mmoll",
    mgdl = "mgdl"
}
export enum NotificationKind {
    weight = "weight",
    glucose = "glucose"
}
export enum Role {
    admin = "admin",
    user = "user"
}
export enum WeightUnit {
    kg = "kg",
    lbs = "lbs"
}
export interface backendInterface {
    addGlucoseEntry(token: string, input: AddGlucoseInput): Promise<Result__1_2>;
    addWeightEntry(token: string, input: AddWeightInput): Promise<Result__1_1>;
    adminGetUserDetail(token: string, userId: UserId): Promise<Result__3_1>;
    adminListUsers(token: string): Promise<Result__3>;
    getAllHealthEntries(token: string, offset: bigint, limit: bigint): Promise<Result__1>;
    getMe(token: string): Promise<Result__2>;
    getMyHealthEntries(token: string, offset: bigint, limit: bigint): Promise<Result__1>;
    getUnreadNotificationCount(token: string): Promise<Result_2>;
    getUnreadNotifications(token: string): Promise<Result_1>;
    getUserHealthEntries(token: string, userId: UserId, offset: bigint, limit: bigint): Promise<Result__1>;
    initAdmin(): Promise<string>;
    isAdmin(): Promise<boolean>;
    login(input: LoginInput): Promise<AuthResult>;
    logout(token: string): Promise<void>;
    markNotificationsRead(token: string, ids: Array<bigint>): Promise<Result>;
    resetAdmin(): Promise<string>;
    signup(input: SignupInput): Promise<AuthResult>;
}
