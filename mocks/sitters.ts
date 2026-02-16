import type { SitterCard } from "@/types/domain";

export const sittersMock: SitterCard[] = [
  {
    id: "s_1",
    name: "Ava",
    city: "Tehran",
    rating: 4.9,
    reviews: 132,
    pricePerNight: 35,
    responseTime: "10m",
    badges: ["Verified", "First Aid"]
  },
  {
    id: "s_2",
    name: "Reza",
    city: "Karaj",
    rating: 4.8,
    reviews: 87,
    pricePerNight: 29,
    responseTime: "25m",
    badges: ["Verified", "Repeat clients"]
  },
  {
    id: "s_3",
    name: "Neda",
    city: "Shiraz",
    rating: 5,
    reviews: 56,
    pricePerNight: 41,
    responseTime: "8m",
    badges: ["Top rated", "Calm home"]
  }
];
