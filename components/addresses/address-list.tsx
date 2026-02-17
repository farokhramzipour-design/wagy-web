"use client";

import { Address } from "@/services/address-api";
import { MapPin, Check } from "lucide-react";

interface AddressListProps {
  addresses: Address[];
  t: any;
}

export default function AddressList({ addresses, t }: AddressListProps) {
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <div
          key={address.address_id}
          className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {address.is_default && (
            <div className="absolute top-4 right-4 text-[#0ea5a4]">
              <Check className="w-5 h-5" />
            </div>
          )}
          
          <div className="flex items-start space-x-3 mb-3">
            <div className="p-2 bg-neutral-50 rounded-lg">
              <MapPin className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{address.label}</h3>
              {address.is_default && (
                <span className="text-xs text-[#0ea5a4] font-medium">Default</span>
              )}
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-neutral-600 pl-[3.25rem]">
            <p className="line-clamp-2">{address.full_address || `${address.address_line1} ${address.address_line2 || ''}`}</p>
            <p>{address.city_id}, {address.province_id}</p> {/* Mock IDs shown, ideally replace with names if available */}
            <p className="font-mono text-xs text-neutral-400 mt-2">{address.postal_code}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
