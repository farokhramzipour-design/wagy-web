import { OrderList } from "@/components/dashboard/orders/order-list";
import { PaginationControls } from "@/components/dashboard/orders/pagination-controls";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { BookingListResponse, getBookings } from "@/services/booking-api";
import { cookies } from "next/headers";

const content = { en, fa };
const ITEMS_PER_PAGE = 10;

interface OrdersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const token = cookieStore.get("waggy_access_token")?.value;
  const t = content[lang].dashboard.orders;

  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;
  // Fetch one extra item to check if there is a next page
  const limit = ITEMS_PER_PAGE + 1;

  let bookings: BookingListResponse[] = [];
  let hasMore = false;

  try {
    if (token) {
      const allBookings = await getBookings(token, { skip, limit });
      if (allBookings.length > ITEMS_PER_PAGE) {
        hasMore = true;
        bookings = allBookings.slice(0, ITEMS_PER_PAGE);
      } else {
        bookings = allBookings;
      }
    }
  } catch (error) {
    console.error("Failed to fetch bookings", error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-800">{t.title}</h1>
      <OrderList bookings={bookings} t={t} lang={lang} />
      <PaginationControls hasMore={hasMore} t={t} lang={lang} />
    </div>
  );
}
