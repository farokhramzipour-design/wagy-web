"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ProviderSearchResult } from "@/services/search-api";
import { Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const content = { en, fa };

export function SitterCard({ provider, isAuthenticated, hasAddress = false }: { provider: ProviderSearchResult; isAuthenticated: boolean; hasAddress?: boolean }) {
    const { lang } = useLanguage();
    const t = content[lang];
    const tSearch = content[lang].search_sitter;
    const router = useRouter();

    const price = provider.service_data.price || provider.service_data.price_per_night || provider.service_data.base_price;

    const handleBook = () => {
        if (!isAuthenticated) {
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }
        // Redirect to booking page (future implementation)
        router.push(`/book/${provider.provider_service_id}`);
    };

    const getDistanceText = () => {
        if (!isAuthenticated) return tSearch.login_to_see_distance;
        if (!hasAddress && provider.distance_km === null) return tSearch.add_address_to_see_distance;
        if (provider.distance_km !== null) return `${provider.distance_km.toFixed(1)} km`;
        return null;
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-primary flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 h-48 sm:h-auto relative bg-gray-100 flex-shrink-0 flex items-center justify-center">
                {provider.avatar_image ? (
                    <Image
                        src={`https://api.waggy.ir${provider.avatar_image}`}
                        alt={provider.business_name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                        <div className="w-16 h-16 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            {provider.service_type.icon_url && (
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <Image
                                        src={`https://api.waggy.ir${provider.service_type.icon_url}`}
                                        alt={provider.service_type.name_en}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{provider.full_name || provider.business_name}</h3>
                                {provider.full_name && <p className="text-sm text-gray-500">{provider.business_name}</p>}
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                        {lang === "fa" ? provider.service_type.name_fa : provider.service_type.name_en}
                                    </Badge>
                                    {provider.verified && (
                                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                            {tSearch.verified_only}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold text-sm">{provider.average_rating}</span>
                                <span className="text-xs text-gray-500">({provider.total_reviews})</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${getDistanceText() === tSearch.login_to_see_distance || getDistanceText() === tSearch.add_address_to_see_distance ? "text-gray-400" : "text-primary"}`} />
                            <span className={getDistanceText() === tSearch.login_to_see_distance || getDistanceText() === tSearch.add_address_to_see_distance ? "text-gray-400 italic" : ""}>
                                {getDistanceText()}
                            </span>
                        </div>

                        {provider.response_time_hours !== null && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{tSearch.response_time}: {provider.response_time_hours}h</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {/* Render some service data highlights */}
                        {Object.entries(provider.service_data).map(([key, value]) => {
                            if (key === 'price' || key === 'price_per_night' || key.includes('price')) return null;
                            if (typeof value === 'boolean' && value) {
                                return <Badge key={key} variant="outline" className="text-xs font-normal">{key.replace(/_/g, ' ')}</Badge>;
                            }
                            return null;
                        })}
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
                    <div>
                        {price && (
                            <div className="text-lg font-bold text-primary">
                                {Number(price).toLocaleString()} <span className="text-xs font-normal text-gray-500">IRR</span>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleBook}>{tSearch.book}</Button>
                </CardFooter>
            </div>
        </Card>
    );
}
