import type { AdminUserRow } from "@/types/domain";

export const adminUsersMock: AdminUserRow[] = [
  { id: "u1", name: "Behnam A.", role: "user", city: "Tehran", status: "active" },
  { id: "u2", name: "Maryam K.", role: "sitter", city: "Isfahan", status: "pending" },
  { id: "u3", name: "Saeed P.", role: "sitter", city: "Shiraz", status: "active" },
  { id: "u4", name: "Ali R.", role: "user", city: "Tabriz", status: "suspended" },
  { id: "u5", name: "Niloofar J.", role: "user", city: "Tehran", status: "active" }
];

export const adminKpiMock = {
  revenue: "$84.2K",
  activeUsers: "12,490",
  pendingReviews: "28",
  openDisputes: "6"
};
