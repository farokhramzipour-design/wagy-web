export interface SitterCard {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  responseTime: string;
  badges: string[];
}

export interface Booking {
  id: string;
  sitterName: string;
  petName: string;
  service: string;
  dateRange: string;
  status: "upcoming" | "past" | "request";
  total: number;
}

export interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface AdminUserRow {
  id: string;
  name: string;
  role: "user" | "sitter" | "admin";
  city: string;
  status: "active" | "pending" | "suspended";
}
