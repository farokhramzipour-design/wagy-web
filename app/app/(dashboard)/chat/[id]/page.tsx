import { cookies } from "next/headers";
import { ChatDetail } from "@/components/chat/chat-detail";
import { getProfile } from "@/services/profile-api";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChatDetailPage({ params }: PageProps) {
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
    // If we can't get the user ID, we can't determine who is "me" in the chat.
    // Ideally redirect to login if unauthorized.
  }

  return <ChatDetail token={token} userId={userId} ticketId={Number(params.id)} />;
}
