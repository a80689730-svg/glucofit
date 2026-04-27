import type { Principal } from "@icp-sdk/core/principal";

export type UserId = Principal;

export enum GlucoseUnit {
  mgdl = "mgdl",
  mmoll = "mmoll",
}

export enum WeightUnit {
  kg = "kg",
  lbs = "lbs",
}

export enum Role {
  user = "user",
  admin = "admin",
}

export enum NotificationKind {
  glucose = "glucose",
  weight = "weight",
}

export interface User {
  id: UserId;
  email: string;
  fullName: string;
  createdAt: bigint;
  role: Role;
}

export interface GlucoseEntry {
  id: bigint;
  userId: UserId;
  value: number;
  unit: GlucoseUnit;
  readingTime: bigint;
  notes: string;
  createdAt: bigint;
}

export interface WeightEntry {
  id: bigint;
  userId: UserId;
  value: number;
  unit: WeightUnit;
  recordedAt: bigint;
  notes: string;
  createdAt: bigint;
}

export interface HealthPage {
  total: bigint;
  offset: bigint;
  limit: bigint;
  glucoseEntries: GlucoseEntry[];
  weightEntries: WeightEntry[];
}

export interface Notification {
  id: bigint;
  kind: NotificationKind;
  userId: UserId;
  userName: string;
  value: number;
  unit: string;
  timestamp: bigint;
  isRead: boolean;
}

export interface UserSummary {
  id: UserId;
  email: string;
  fullName: string;
  createdAt: bigint;
  entryCount: bigint;
}

export interface UserDetail {
  id: UserId;
  email: string;
  fullName: string;
  createdAt: bigint;
  glucoseEntries: GlucoseEntry[];
  weightEntries: WeightEntry[];
}

export interface AddGlucoseInput {
  value: number;
  unit: GlucoseUnit;
  readingTime: bigint;
  notes: string;
}

export interface AddWeightInput {
  value: number;
  unit: WeightUnit;
  recordedAt: bigint;
  notes: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
