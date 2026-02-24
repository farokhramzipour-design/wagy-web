"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { BookingResponse } from "@/services/booking-api";
import { ArrowLeft, PawPrint, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { OrderStatusBadge } from "./order-status-badge";
import { PayButton } from "./pay-button";

interface OrderDetailsProps {
    booking: BookingResponse;
    t: any;
    lang: string;
    token: string;
}

export function OrderDetails({ booking, t, lang, token }: OrderDetailsProps) {
    const [cancelOpen, setCancelOpen] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return "-";
        return timeString.substring(0, 5);
    };

    const showPay = ["pending", "confirmed"].includes(booking.status);
    const showCancel = ["pending", "confirmed", "paid"].includes(booking.status);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/app/orders">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-neutral-800">
                    {t.details.title} #{booking.booking_id}
                </h1>
                <div className="ml-auto">
                    <OrderStatusBadge status={booking.status} t={t} />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Service Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                {t.details.serviceInfo}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                                <span className="text-neutral-600">{t.list.service}</span>
                                <span className="font-medium">{booking.service.service_type_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                                <span className="text-neutral-600">{t.list.bookingDate}</span>
                                <span className="font-medium">{formatDate(booking.booking_date)}</span>
                            </div>
                            {booking.start_time && (
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                                    <span className="text-neutral-600">Time</span>
                                    <span className="font-medium">{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                </div>
                            )}
                            {booking.check_in_date && (
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                                    <span className="text-neutral-600">Check-in</span>
                                    <span className="font-medium">{formatDate(booking.check_in_date)}</span>
                                </div>
                            )}
                            {booking.check_out_date && (
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                                    <span className="text-neutral-600">Check-out</span>
                                    <span className="font-medium">{formatDate(booking.check_out_date)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Provider Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-primary" />
                                {t.details.providerInfo}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-neutral-600">{t.list.provider}</span>
                                <span className="font-medium">{booking.provider.business_name}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pet Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <PawPrint className="h-5 w-5 text-primary" />
                                {t.details.petInfo}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {booking.pets.map(pet => (
                                    <div key={pet.pet_id} className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100">
                                        <span className="text-sm font-medium">{pet.name}</span>
                                        <span className="text-xs text-neutral-500">({pet.breed_name})</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t.details.paymentInfo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">{t.details.basePrice}</span>
                                <span>{formatPrice(booking.base_price, "IRR", lang === "fa" ? "fa-IR" : "en-US")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">{t.details.additionalPetPrice}</span>
                                <span>{formatPrice(booking.additional_pet_price, "IRR", lang === "fa" ? "fa-IR" : "en-US")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">{t.details.serviceFee}</span>
                                <span>{formatPrice(booking.service_fee, "IRR", lang === "fa" ? "fa-IR" : "en-US")}</span>
                            </div>
                            <div className="h-px bg-neutral-200" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>{t.details.totalPrice}</span>
                                <span>{formatPrice(booking.total_price, "IRR", lang === "fa" ? "fa-IR" : "en-US")}</span>
                            </div>

                            {showPay && (
                                <div className="pt-4 w-full">
                                    <div className="w-full">
                                        <PayButton bookingId={booking.booking_id} token={token} t={t} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {showCancel && (
                        <Card>
                            <CardContent className="pt-6">
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setCancelOpen(true)}
                                >
                                    {t.details.actions.cancel}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <CancelBookingDialog
                bookingId={booking.booking_id}
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                t={t}
                token={token}
            />
        </div>
    );
}
