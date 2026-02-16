import { bookingsMock } from "@/mocks/bookings";
import { chatsMock } from "@/mocks/chats";
import { sittersMock } from "@/mocks/sitters";
import { adminKpiMock, adminUsersMock } from "@/mocks/admin";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchSitters() {
  await wait(500);
  return sittersMock;
}

export async function fetchBookings() {
  await wait(500);
  return bookingsMock;
}

export async function fetchChats() {
  await wait(500);
  return chatsMock;
}

export async function fetchAdminUsers() {
  await wait(600);
  return adminUsersMock;
}

export async function fetchAdminKpis() {
  await wait(450);
  return adminKpiMock;
}
