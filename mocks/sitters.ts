import { Sitter } from "@/types";

export const sittersMock: Sitter[] = [
  {
    id: "s_1",
    name: "Maya Thompson",
    city: "Austin",
    rating: 4.9,
    services: ["boarding", "daycare", "walking"],
    pricePerNight: 52,
    verified: true
  },
  {
    id: "s_2",
    name: "Reza Mohammadi",
    city: "Tehran",
    rating: 4.8,
    services: ["house_sitting", "drop_in"],
    pricePerNight: 45,
    verified: true
  },
  {
    id: "s_3",
    name: "Sarah Collins",
    city: "Seattle",
    rating: 4.7,
    services: ["walking", "drop_in"],
    pricePerNight: 38,
    verified: false
  }
];
