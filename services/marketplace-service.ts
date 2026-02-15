import { useQuery } from "@tanstack/react-query";
import { bookingsMock } from "@/mocks/bookings";
import { chatsMock } from "@/mocks/chats";
import { sittersMock } from "@/mocks/sitters";
import { mockApi } from "@/services/api-client";

export const marketplaceService = {
  getSitters: async () => mockApi(sittersMock),
  getBookings: async () => mockApi(bookingsMock),
  getChats: async () => mockApi(chatsMock)
};

export function useSittersQuery() {
  return useQuery({ queryKey: ["sitters"], queryFn: marketplaceService.getSitters });
}

export function useBookingsQuery() {
  return useQuery({ queryKey: ["bookings"], queryFn: marketplaceService.getBookings });
}

export function useChatsQuery() {
  return useQuery({ queryKey: ["chats"], queryFn: marketplaceService.getChats });
}
