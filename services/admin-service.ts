import { useQuery } from "@tanstack/react-query";
import { adminKpiMock, adminSittersMock, adminUsersMock } from "@/mocks/admin";
import { mockApi } from "@/services/api-client";

export const adminService = {
  getKpis: async () => mockApi(adminKpiMock),
  getUsers: async () => mockApi(adminUsersMock),
  getSitters: async () => mockApi(adminSittersMock)
};

export function useAdminKpisQuery() {
  return useQuery({ queryKey: ["admin-kpis"], queryFn: adminService.getKpis });
}

export function useAdminUsersQuery() {
  return useQuery({ queryKey: ["admin-users"], queryFn: adminService.getUsers });
}

export function useAdminSittersQuery() {
  return useQuery({ queryKey: ["admin-sitters"], queryFn: adminService.getSitters });
}
