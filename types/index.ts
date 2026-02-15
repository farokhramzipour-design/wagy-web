export type Language = "en" | "fa";
export type Role = "guest" | "user" | "admin";
export type SitterStatus = "draft" | "pending_review" | "approved";

export interface User {
  id: string;
  fullName: string;
  phone: string;
  role: Role;
  isSitter: boolean;
  avatar: string;
}

export interface Sitter {
  id: string;
  name: string;
  city: string;
  rating: number;
  services: string[];
  pricePerNight: number;
  verified: boolean;
}

export interface Booking {
  id: string;
  petName: string;
  sitterName: string;
  service: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "past" | "request";
}

export interface ChatThread {
  id: string;
  contactName: string;
  lastMessage: string;
  unread: number;
}
