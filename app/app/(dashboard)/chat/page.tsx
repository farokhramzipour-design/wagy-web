import { cookies } from "next/headers";
import { ChatList } from "@/components/chat/chat-list";
import { getProfile } from "@/services/profile-api";
import { redirect } from "next/navigation";

export default async function ChatListPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("waggy_access_token")?.value;

  if (!token) {
    redirect("/auth");
  }

  let userId = 0;
  try {
    const profile = await getProfile(token);
    userId = profile.user_id;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    // If profile fetch fails (e.g. token expired), we might want to redirect to auth
    // or just let the chat list fail gracefully.
  }

  return <ChatList token={token} userId={userId} />;
}
