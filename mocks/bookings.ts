import { Booking } from "@/types";

export const bookingsMock: Booking[] = [
  {
    id: "b_1",
    petName: "Luna",
    sitterName: "Maya Thompson",
    service: "boarding",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    status: "upcoming"
  },
  {
    id: "b_2",
    petName: "Max",
    sitterName: "Sarah Collins",
    service: "walking",
    startDate: "2026-01-18",
    endDate: "2026-01-18",
    status: "past"
  },
  {
    id: "b_3",
    petName: "Coco",
    sitterName: "Reza Mohammadi",
    service: "dropIn",
    startDate: "2026-02-20",
    endDate: "2026-02-20",
    status: "request"
  }
];
