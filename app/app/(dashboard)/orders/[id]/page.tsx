import { cookies } from "next/headers";
import { getBooking } from "@/services/booking-api";
import { OrderDetails } from "@/components/dashboard/orders/order-details";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { notFound } from "next/navigation";

const content = { en, fa };

interface OrderDetailsPageProps {
  params: { id: string };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const token = cookieStore.get("waggy_access_token")?.value;
  const t = content[lang].dashboard.orders;

  if (!token) {
    // Ideally redirect to login, but for now just not found or unauthorized
    return notFound();
  }

  try {
    const booking = await getBooking(token, parseInt(params.id));
    
    if (!booking) {
        return notFound();
    }

    return (
        <OrderDetails booking={booking} t={t} lang={lang} token={token} />
    );
  } catch (error) {
    console.error("Failed to fetch booking details", error);
    return notFound();
  }
}
