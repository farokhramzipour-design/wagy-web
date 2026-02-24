import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { BookingListResponse } from "@/services/booking-api";
import { Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderListProps {
  bookings: BookingListResponse[];
  t: any;
  lang: string;
}

export function OrderList({ bookings, t, lang }: OrderListProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-500">{t.empty}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.booking_id}
          className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900">
                {booking.service_type_name}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-sm text-neutral-600">
                {booking.provider_business_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(booking.booking_date)}</span>
              <span>•</span>
              <span>{booking.number_of_pets} {t.details.petInfo}</span>
            </div>
            <div className="text-sm font-medium text-neutral-900">
              {formatPrice(booking.total_price, "IRR", lang === "fa" ? "fa-IR" : "en-US")}
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end sm:gap-2">
            <OrderStatusBadge status={booking.status} t={t} />
            <Button asChild variant="outline" size="sm">
              <Link href={`/app/orders/${booking.booking_id}`}>
                {t.list.viewDetails}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
