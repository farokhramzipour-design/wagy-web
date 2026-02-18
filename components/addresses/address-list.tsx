"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Address, deleteAddressClient } from "@/services/address-api";
import { MapPin, Trash2 } from "lucide-react";
import EditAddressDialog from "./edit-address-dialog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AddressListProps {
  addresses: Address[];
  t: any;
}

export default function AddressList({ addresses, t }: AddressListProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteAddressClient(deleteId);
      toast.success(t.validation?.deleteSuccess || "Address deleted successfully");
      router.refresh();
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete address", error);
      toast.error(t.validation?.deleteError || "Failed to delete address");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!addresses || addresses.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-500">{t.empty}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <div
            key={address.address_id}
            className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="absolute top-4 end-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditAddressDialog t={t} address={address} />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => setDeleteId(address.address_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-neutral-50 rounded-lg shrink-0">
                <MapPin className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{address.label}</h3>
                {address.is_default && (
                  <span className="text-xs text-[#0ea5a4] font-medium">Default</span>
                )}
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-neutral-600 ps-[3.25rem]">
              <p className="line-clamp-2">{address.full_address || `${address.address_line1} ${address.address_line2 || ''}`}</p>
              <p>{address.city_id}, {address.province_id}</p> {/* Mock IDs shown, ideally replace with names if available */}
              <p className="font-mono text-xs text-neutral-400 mt-2">{address.postal_code}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.delete?.title || "Delete Address"}</DialogTitle>
            <DialogDescription>
              {t.delete?.confirm || "Are you sure you want to delete this address? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              {t.actions?.cancel || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (t.actions?.deleting || "Deleting...") : (t.actions?.delete || "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
