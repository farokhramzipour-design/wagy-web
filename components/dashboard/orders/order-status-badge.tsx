import { Badge } from "@/components/ui/badge";
import { BookingResponse } from "@/services/booking-api";

interface OrderStatusBadgeProps {
  status: BookingResponse["status"];
  t: any;
}

export function OrderStatusBadge({ status, t }: OrderStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled_user":
      case "cancelled_provider":
      case "cancelled_admin":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "expired":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor(status)} border-transparent font-medium`}>
      {t.status[status] || status}
    </Badge>
  );
}
