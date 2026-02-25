"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { Pet } from "@/services/pet-api";
import { ProviderSearchResult } from "@/services/search-api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface BookingModalProps {
    provider: ProviderSearchResult;
    children: React.ReactNode;
}

export function BookingModal({ provider, children }: BookingModalProps) {
    const { lang } = useLanguage();
    const t = content[lang];
    const tBooking = content[lang].booking;
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    // Form State
    const [bookingType, setBookingType] = useState<"hourly" | "overnight">("hourly");
    const [bookingDate, setBookingDate] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [durationHours, setDurationHours] = useState<number | null>(null);
    const [specialRequests, setSpecialRequests] = useState("");

    const [pets, setPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);
    const [selectedPetIds, setSelectedPetIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            fetchPets();

            // Initialize from search params
            const pBookingDate = searchParams.get("booking_date");
            const pCheckInDate = searchParams.get("check_in_date");
            const pCheckOutDate = searchParams.get("check_out_date");
            const pStartTime = searchParams.get("start_time");
            const pDuration = searchParams.get("duration_hours");

            if (pCheckInDate || pCheckOutDate) {
                setBookingType("overnight");
                if (pCheckInDate) setCheckInDate(pCheckInDate);
                if (pCheckOutDate) setCheckOutDate(pCheckOutDate);
            } else {
                setBookingType("hourly");
                if (pBookingDate) setBookingDate(pBookingDate);
                if (pStartTime) setStartTime(pStartTime);
                if (pDuration) setDurationHours(parseInt(pDuration));
            }
        }
    }, [open, searchParams]);

    const fetchPets = async () => {
        setLoadingPets(true);
        try {
            const res = await fetch("/api/v1/pets");
            if (!res.ok) throw new Error("Failed to fetch pets");
            const data = await res.json();
            setPets(data);
        } catch (err) {
            console.error(err);
            toast.error(tBooking.error || "Failed to load pets");
        } finally {
            setLoadingPets(false);
        }
    };

    const togglePet = (petId: number) => {
        setSelectedPetIds(prev =>
            prev.includes(petId)
                ? prev.filter(id => id !== petId)
                : [...prev, petId]
        );
    };

    const handleBooking = async () => {
        if (selectedPetIds.length === 0) {
            toast.error(tBooking.select_at_least_one_pet);
            return;
        }

        // Validation
        if (bookingType === "hourly") {
            if (!bookingDate) {
                toast.error(tBooking.dates_required || "Please select a date");
                return;
            }
            if (!startTime) {
                toast.error("Please select a start time"); // TODO: Add l10n
                return;
            }
            if (!durationHours) {
                toast.error(tBooking.enter_duration || "Please enter duration");
                return;
            }
        } else {
            if (!checkInDate || !checkOutDate) {
                toast.error(tBooking.dates_required || "Please select check-in and check-out dates");
                return;
            }
        }

        setSubmitting(true);
        try {
            const payload = {
                provider_service_id: provider.provider_service_id,
                pet_ids: selectedPetIds,
                booking_date: bookingType === "hourly" ? bookingDate : checkInDate,
                start_time: bookingType === "hourly" ? startTime : null,
                end_time: null, // calculated by backend
                duration_hours: bookingType === "hourly" ? durationHours : null,
                check_in_date: bookingType === "overnight" ? checkInDate : null,
                check_out_date: bookingType === "overnight" ? checkOutDate : null,
                special_requests: specialRequests || null
            };

            const res = await fetch("/api/v1/bookings", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Booking failed");
            }

            toast.success(tBooking.success);
            setOpen(false);
            router.push("/app/orders");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || tBooking.error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{tBooking.title}</DialogTitle>
                    <DialogDescription>
                        {tBooking.booking_details} - {provider.business_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Booking Type Selection */}
                    <div className="space-y-2">
                        <Label>{tBooking.booking_type || "Booking Type"}</Label>
                        <RadioGroup
                            defaultValue="hourly"
                            value={bookingType}
                            onValueChange={(v) => setBookingType(v as "hourly" | "overnight")}
                            className="flex flex-row gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hourly" id="r-hourly" />
                                <Label htmlFor="r-hourly">{tBooking.hourly || "Hourly"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="overnight" id="r-overnight" />
                                <Label htmlFor="r-overnight">{tBooking.overnight || "Overnight"}</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Dynamic Date/Time Fields */}
                    {bookingType === "hourly" ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="booking-date">{tBooking.dates || "Date"}</Label>
                                <Input
                                    id="booking-date"
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start-time">{tBooking.start_time || "Start Time"}</Label>
                                <Input
                                    id="start-time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="duration">{tBooking.duration || "Duration (hours)"}</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    placeholder={tBooking.enter_duration}
                                    value={durationHours || ""}
                                    onChange={(e) => setDurationHours(e.target.value ? parseInt(e.target.value) : null)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="check-in">{tBooking.check_in || "Check-in Date"}</Label>
                                <Input
                                    id="check-in"
                                    type="date"
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="check-out">{tBooking.check_out || "Check-out Date"}</Label>
                                <Input
                                    id="check-out"
                                    type="date"
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Pets Selection */}
                    <div className="space-y-2">
                        <Label>{tBooking.select_pets}</Label>
                        {loadingPets ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : pets.length > 0 ? (
                            <div className="grid gap-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                                {pets.map(pet => (
                                    <div key={pet.pet_id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => togglePet(pet.pet_id)}>
                                        <Checkbox
                                            id={`pet-${pet.pet_id}`}
                                            checked={selectedPetIds.includes(pet.pet_id)}
                                            onCheckedChange={() => togglePet(pet.pet_id)}
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                {pet.avatar_url ? (
                                                    <Image
                                                        src={`https://api.waggy.ir${pet.avatar_url}`}
                                                        alt={pet.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                        {pet.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <label
                                                htmlFor={`pet-${pet.pet_id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                            >
                                                {pet.name}
                                                <span className="block text-xs text-gray-500 font-normal">{pet.pet_type}</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                {tBooking.no_pets}
                                <Button variant="link" onClick={() => router.push("/app/pets/new")} className="p-0 h-auto ml-1">
                                    {tBooking.add_pet}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-2">
                        <Label htmlFor="special-requests">{tBooking.special_requests}</Label>
                        <Textarea
                            id="special-requests"
                            placeholder={tBooking.special_requests_placeholder}
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                        {tBooking.cancel}
                    </Button>
                    <Button onClick={handleBooking} disabled={submitting || loadingPets}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {tBooking.confirm}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
