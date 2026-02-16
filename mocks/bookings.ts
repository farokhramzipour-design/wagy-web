import type { Booking } from "@/types/domain";

export const bookingsMock: Booking[] = [
  {
    id: "b_1",
    sitterName: "Ava",
    petName: "Milo",
    service: "Boarding",
    dateRange: "Aug 14 - Aug 17",
    status: "upcoming",
    total: 120
  },
  {
    id: "b_2",
    sitterName: "Reza",
    petName: "Luna",
    service: "Dog Walking",
    dateRange: "Aug 03",
    status: "past",
    total: 22
  },
  {
    id: "b_3",
    sitterName: "Neda",
    petName: "Coco",
    service: "Drop-In Visits",
    dateRange: "Aug 22 - Aug 24",
    status: "request",
    total: 48
  }
];
