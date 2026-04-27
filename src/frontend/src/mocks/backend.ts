import type { backendInterface, GlucoseUnit, WeightUnit, NotificationKind, Role } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = Principal.fromText("aaaaa-aa");
const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleUser = {
  id: samplePrincipal,
  createdAt: now,
  role: "user" as Role,
  fullName: "Sarah Johnson",
  email: "sarah@example.com",
};

const sampleGlucoseEntries = [
  {
    id: BigInt(1),
    readingTime: now - BigInt(3_600_000_000_000),
    value: 95,
    userId: samplePrincipal,
    createdAt: now - BigInt(3_600_000_000_000),
    unit: "mgdl" as GlucoseUnit,
    notes: "Before breakfast",
  },
  {
    id: BigInt(2),
    readingTime: now - BigInt(7_200_000_000_000),
    value: 110,
    userId: samplePrincipal,
    createdAt: now - BigInt(7_200_000_000_000),
    unit: "mgdl" as GlucoseUnit,
    notes: "After lunch",
  },
  {
    id: BigInt(3),
    readingTime: now - BigInt(86_400_000_000_000),
    value: 88,
    userId: samplePrincipal,
    createdAt: now - BigInt(86_400_000_000_000),
    unit: "mgdl" as GlucoseUnit,
    notes: "Morning reading",
  },
];

const sampleWeightEntries = [
  {
    id: BigInt(1),
    value: 72.5,
    userId: samplePrincipal,
    createdAt: now,
    unit: "kg" as WeightUnit,
    recordedAt: now,
    notes: "Morning weight",
  },
  {
    id: BigInt(2),
    value: 73.1,
    userId: samplePrincipal,
    createdAt: now - BigInt(86_400_000_000_000),
    unit: "kg" as WeightUnit,
    recordedAt: now - BigInt(86_400_000_000_000),
    notes: "",
  },
];

const sampleNotifications = [
  {
    id: BigInt(1),
    userName: "Sarah Johnson",
    value: 95,
    userId: samplePrincipal,
    kind: "glucose" as NotificationKind,
    unit: "mg/dL",
    isRead: false,
    timestamp: now - BigInt(3_600_000_000_000),
  },
  {
    id: BigInt(2),
    userName: "John Doe",
    value: 72.5,
    userId: samplePrincipal,
    kind: "weight" as NotificationKind,
    unit: "kg",
    isRead: false,
    timestamp: now - BigInt(7_200_000_000_000),
  },
];

export const mockBackend: backendInterface = {
  addGlucoseEntry: async (_token, _input) => ({
    __kind__: "ok",
    ok: sampleGlucoseEntries[0],
  }),
  addWeightEntry: async (_token, _input) => ({
    __kind__: "ok",
    ok: sampleWeightEntries[0],
  }),
  adminGetUserDetail: async (_token, _userId) => ({
    __kind__: "ok",
    ok: {
      id: samplePrincipal,
      createdAt: now,
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      weightEntries: sampleWeightEntries,
      glucoseEntries: sampleGlucoseEntries,
    },
  }),
  adminListUsers: async (_token) => ({
    __kind__: "ok",
    ok: [
      {
        id: samplePrincipal,
        entryCount: BigInt(5),
        createdAt: now - BigInt(86_400_000_000_000 * 7),
        fullName: "Sarah Johnson",
        email: "sarah@example.com",
      },
      {
        id: samplePrincipal,
        entryCount: BigInt(3),
        createdAt: now - BigInt(86_400_000_000_000 * 3),
        fullName: "John Doe",
        email: "john@example.com",
      },
    ],
  }),
  getAllHealthEntries: async (_token, _offset, _limit) => ({
    __kind__: "ok",
    ok: {
      total: BigInt(5),
      offset: BigInt(0),
      limit: BigInt(10),
      weightEntries: sampleWeightEntries,
      glucoseEntries: sampleGlucoseEntries,
    },
  }),
  getMe: async (_token) => ({
    __kind__: "ok",
    ok: sampleUser,
  }),
  getMyHealthEntries: async (_token, _offset, _limit) => ({
    __kind__: "ok",
    ok: {
      total: BigInt(5),
      offset: BigInt(0),
      limit: BigInt(10),
      weightEntries: sampleWeightEntries,
      glucoseEntries: sampleGlucoseEntries,
    },
  }),
  getUnreadNotificationCount: async (_token) => ({
    __kind__: "ok",
    ok: BigInt(2),
  }),
  getUnreadNotifications: async (_token) => ({
    __kind__: "ok",
    ok: sampleNotifications,
  }),
  getUserHealthEntries: async (_token, _userId, _offset, _limit) => ({
    __kind__: "ok",
    ok: {
      total: BigInt(5),
      offset: BigInt(0),
      limit: BigInt(10),
      weightEntries: sampleWeightEntries,
      glucoseEntries: sampleGlucoseEntries,
    },
  }),
  initAdmin: async () => "Admin initialized",
  isAdmin: async () => false,
  resetAdmin: async () => "Admin reset",
  login: async (_input) => ({
    __kind__: "ok",
    ok: {
      token: "mock-token-123",
      user: sampleUser,
    },
  }),
  logout: async (_token) => undefined,
  markNotificationsRead: async (_token, _ids) => ({
    __kind__: "ok",
    ok: null,
  }),
  signup: async (_input) => ({
    __kind__: "ok",
    ok: {
      token: "mock-token-new",
      user: sampleUser,
    },
  }),
};
