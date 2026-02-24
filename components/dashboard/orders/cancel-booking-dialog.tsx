"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cancelBooking } from "@/services/booking-api";
import { useRouter } from "next/navigation";

interface CancelBookingDialogProps {
  bookingId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: any;
  token: string;
}

export function CancelBookingDialog({
  bookingId,
  open,
  onOpenChange,
  t,
  token,
}: CancelBookingDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("user_changed_plans");
  const [notes, setNotes] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelBooking(token, bookingId, { reason, notes });
      toast.success(t.details.cancelModal.success || "Booking cancelled successfully");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error(t.details.cancelModal.error || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.details.cancelModal.title}</DialogTitle>
          <DialogDescription>{t.details.cancelModal.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">{t.details.cancelModal.reasonLabel}</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user_changed_plans">Change of plans</SelectItem>
                <SelectItem value="user_emergency">Emergency</SelectItem>
                <SelectItem value="pet_health_issue">Pet health issue</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">{t.details.cancelModal.notesLabel}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t.details.cancelModal.cancel}
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading ? "Processing..." : t.details.cancelModal.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
