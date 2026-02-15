export const adminUsersMock = [
  { id: "u1", name: "Behnam", role: "user", city: "Austin", status: "active" },
  { id: "u2", name: "Ana", role: "user", city: "Denver", status: "active" },
  { id: "u3", name: "Tom", role: "sitter", city: "Seattle", status: "pending" }
];

export const adminSittersMock = [
  { id: "s1", name: "Maya Thompson", city: "Austin", submittedAt: "2026-02-10", status: "pending" },
  { id: "s2", name: "Reza Mohammadi", city: "Tehran", submittedAt: "2026-02-11", status: "pending" }
];

export const adminKpiMock = {
  revenue: "$124,500",
  activeUsers: "3,482",
  activeSitters: "614",
  openDisputes: "14"
};
