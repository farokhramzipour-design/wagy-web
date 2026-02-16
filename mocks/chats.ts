import type { ChatPreview } from "@/types/domain";

export const chatsMock: ChatPreview[] = [
  {
    id: "c_1",
    name: "Ava",
    lastMessage: "Milo finished dinner and is resting now 🐶",
    time: "2m",
    unread: 1
  },
  {
    id: "c_2",
    name: "Reza",
    lastMessage: "See you tomorrow at 9:00 for the walk.",
    time: "1h",
    unread: 0
  },
  {
    id: "c_3",
    name: "Support",
    lastMessage: "We are here whenever you need us.",
    time: "3h",
    unread: 0
  }
];
