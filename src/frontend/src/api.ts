import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "./backend";
import type {
  AddGlucoseInput,
  AddWeightInput,
  AuthResult,
  GlucoseEntry,
  HealthPage,
  Notification,
  User,
  UserDetail,
  UserSummary,
  WeightEntry,
} from "./backend";

export { useActor };

// Helper to use actor - returns a Backend instance
export function useBackendActor() {
  return useActor(createActor);
}

type BackendActor = ReturnType<typeof useBackendActor>["actor"];

function unwrapResult<T>(
  result: { __kind__: "ok"; ok: T } | { __kind__: "err"; err: string },
): T {
  if (result.__kind__ === "ok") return result.ok;
  throw new Error(result.err);
}

export async function apiSignup(
  actor: NonNullable<BackendActor>,
  email: string,
  password: string,
  fullName: string,
): Promise<{ token: string; user: User }> {
  const result = await actor.signup({ email, password, fullName });
  return unwrapResult(result);
}

export async function apiLogin(
  actor: NonNullable<BackendActor>,
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  const result = await actor.login({ email, password });
  return unwrapResult(result);
}

export async function apiLogout(
  actor: NonNullable<BackendActor>,
  token: string,
): Promise<void> {
  await actor.logout(token);
}

export async function apiGetMe(
  actor: NonNullable<BackendActor>,
  token: string,
): Promise<User> {
  const result = await actor.getMe(token);
  return unwrapResult(result);
}

export async function apiIsAdmin(
  actor: NonNullable<BackendActor>,
): Promise<boolean> {
  return actor.isAdmin();
}

export async function apiAddGlucoseEntry(
  actor: NonNullable<BackendActor>,
  token: string,
  input: AddGlucoseInput,
): Promise<GlucoseEntry> {
  const result = await actor.addGlucoseEntry(token, input);
  return unwrapResult(result);
}

export async function apiAddWeightEntry(
  actor: NonNullable<BackendActor>,
  token: string,
  input: AddWeightInput,
): Promise<WeightEntry> {
  const result = await actor.addWeightEntry(token, input);
  return unwrapResult(result);
}

export async function apiGetMyHealthEntries(
  actor: NonNullable<BackendActor>,
  token: string,
  offset: bigint,
  limit: bigint,
): Promise<HealthPage> {
  const result = await actor.getMyHealthEntries(token, offset, limit);
  return unwrapResult(result);
}

export async function apiGetUnreadNotifications(
  actor: NonNullable<BackendActor>,
  token: string,
): Promise<Notification[]> {
  const result = await actor.getUnreadNotifications(token);
  return unwrapResult(result);
}

export async function apiGetUnreadNotificationCount(
  actor: NonNullable<BackendActor>,
  token: string,
): Promise<bigint> {
  const result = await actor.getUnreadNotificationCount(token);
  return unwrapResult(result);
}

export async function apiMarkNotificationsRead(
  actor: NonNullable<BackendActor>,
  token: string,
  ids: bigint[],
): Promise<void> {
  const result = await actor.markNotificationsRead(token, ids);
  unwrapResult(result);
}

export async function apiAdminListUsers(
  actor: NonNullable<BackendActor>,
  token: string,
): Promise<UserSummary[]> {
  const result = await actor.adminListUsers(token);
  return unwrapResult(result);
}

export async function apiAdminGetUserDetail(
  actor: NonNullable<BackendActor>,
  token: string,
  userId: string,
): Promise<UserDetail> {
  // userId is Principal string; backend expects Principal
  const result = await actor.adminGetUserDetail(
    token,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId as any,
  );
  return unwrapResult(result);
}

export async function apiGetAllHealthEntries(
  actor: NonNullable<BackendActor>,
  token: string,
  offset: bigint,
  limit: bigint,
): Promise<HealthPage> {
  const result = await actor.getAllHealthEntries(token, offset, limit);
  return unwrapResult(result);
}

export async function apiGetUserHealthEntries(
  actor: NonNullable<BackendActor>,
  token: string,
  userId: string,
  offset: bigint,
  limit: bigint,
): Promise<HealthPage> {
  const result = await actor.getUserHealthEntries(
    token,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId as any,
    offset,
    limit,
  );
  return unwrapResult(result);
}
