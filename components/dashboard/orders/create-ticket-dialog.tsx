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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { chatApi } from "@/services/chat-api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CreateTicketDialogProps {
  bookingId: number;
  providerId: number;
  providerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: any;
  token: string;
}

export function CreateTicketDialog({
  bookingId,
  providerId,
  providerName,
  open,
  onOpenChange,
  t,
  token,
}: CreateTicketDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleCreateTicket = async () => {
    if (!message.trim()) {
      toast.error(t.details.messageModal.emptyError || "Please enter a message");
      return;
    }

    setLoading(true);
    try {
      const ticket = await chatApi.createTicket(token, {
        provider_id: providerId,
        booking_id: bookingId,
        subject: subject.trim() || undefined,
        text: message,
      });
      
      toast.success(t.details.messageModal.success || "Message sent successfully");
      onOpenChange(false);
      // Redirect to the new chat
      router.push(`/app/chat/${ticket.ticket_id}`);
    } catch (error: any) {
      console.error("Failed to create ticket", error);
      // Handle duplicate ticket error specifically if needed, otherwise generic error
      if (error?.message?.includes("duplicate")) {
          toast.error(t.details.messageModal.duplicateError || "A conversation for this booking already exists.");
          // Ideally we should find that ticket and redirect, but for now just error.
      } else {
          toast.error(t.details.messageModal.error || "Failed to send message");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{(t.details.messageModal.title || "Message {provider}").replace("{provider}", providerName)}</DialogTitle>
          <DialogDescription>
            {t.details.messageModal.description || "Send a message to the provider about your booking."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">{t.details.messageModal.subjectLabel || "Subject (Optional)"}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`Booking #${bookingId}`}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">{t.details.messageModal.messageLabel || "Message"}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.details.messageModal.placeholder || "Type your message here..."}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t.details.messageModal.cancel || "Cancel"}
          </Button>
          <Button onClick={handleCreateTicket} disabled={loading || !message.trim()} className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {t.details.messageModal.send || "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
