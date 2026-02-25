"use client";

import { Header } from "@/components/layout/header";
import { useLanguage } from "@/components/providers/language-provider";
import { DiscoverySearchBar } from "@/components/search/discovery-search-bar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SessionData } from "@/lib/session";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { Address, getAddresses } from "@/services/address-api";
import { ProfileCompletionResponse } from "@/services/profile-api";
import {
    getAvailableFilters,
    SearchAvailableFiltersResponse,
    searchProviders,
    SearchProvidersRequest,
    SearchProvidersResponse
} from "@/services/search-api";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SearchFiltersSidebar } from "./search-filters-sidebar";
import { SitterCard } from "./sitter-card";

import { format } from "date-fns";

const content = { en, fa };

import { SearchDiscoveryServiceType } from "@/services/search-api";

interface SearchPageClientProps {
    userToken?: string;
    user: SessionData | null;
    profileCompletion: ProfileCompletionResponse | null;
    initialServiceTypes: SearchDiscoveryServiceType[];
}

export function SearchPageClient({ userToken, user, profileCompletion, initialServiceTypes }: SearchPageClientProps) {
    const { lang } = useLanguage();
    const t = content[lang];
    const tSearch = content[lang].search_sitter;
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [results, setResults] = useState<SearchProvidersResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [filtersMetadata, setFiltersMetadata] = useState<SearchAvailableFiltersResponse | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("default");
    const [addressesLoaded, setAddressesLoaded] = useState(false);

    // Filter State
    const [filters, setFilters] = useState<Record<string, any>>({}); // UI state
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({}); // Search state
    const [pagination, setPagination] = useState({ skip: 0, limit: 20 });

    // Load Addresses
    useEffect(() => {
        if (userToken) {
            getAddresses(userToken).then(res => {
                setAddresses(res);
                if (res.length > 0) {
                    const defaultAddr = res.find(a => a.is_default) || res[0];
                    setSelectedAddressId(defaultAddr.address_id.toString());
                }
            }).catch(err => {
                console.error("Failed to load addresses", err);
            }).finally(() => {
                setAddressesLoaded(true);
            });
        } else {
            setAddressesLoaded(true);
        }
    }, [userToken]);

    const handleAddAddress = () => {
        router.push("/app/addresses");
    };

    // Load Metadata
    useEffect(() => {
        const serviceTypeId = searchParams.get("service_type_id");
        if (serviceTypeId) {
            getAvailableFilters(parseInt(serviceTypeId)).then(setFiltersMetadata).catch(console.error);
        }
    }, [searchParams]);

    // Search Logic
    const executeSearch = useCallback(async () => {
        const serviceTypeId = searchParams.get("service_type_id");
        if (!serviceTypeId) return;

        setLoading(true);
        try {
            const dateParam = searchParams.get("date");
            const formattedDate = dateParam ? format(new Date(dateParam), "yyyy-MM-dd") : undefined;

            const req: SearchProvidersRequest = {
                service_type_id: parseInt(serviceTypeId),
                limit: pagination.limit,
                skip: pagination.skip,
                filters: appliedFilters,
                booking_date: formattedDate,
                number_of_pets: searchParams.get("pets") ? parseInt(searchParams.get("pets")!) : 1,
            };

            // Add Location
            if (userToken && addresses.length > 0) {
                const addr = addresses.find(a => a.address_id.toString() === selectedAddressId);
                if (addr) {
                    req.latitude = addr.lat;
                    req.longitude = addr.lng;
                }
            }

            const res = await searchProviders(req);
            setResults(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [searchParams, appliedFilters, pagination, userToken, addresses, selectedAddressId]);

    // Trigger Search
    useEffect(() => {
        if (!addressesLoaded) return;
        executeSearch();
    }, [addressesLoaded, executeSearch]);
    // executeSearch depends on appliedFilters, searchParams, selectedAddressId.
    // So this effect runs whenever those change.

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
    };

    return (
        <div className="min-h-screen bg-[#f2f4f7] pb-16">
            <Header user={user} profileCompletion={profileCompletion} />

            {/* Hero Section */}
            <div className="bg-[#f0fbfa] border-b border-[#dce6e8]">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <h1 className="text-3xl font-bold text-[#103745] mb-6 text-center">{t.nav.cta}</h1>
                    <div className="max-w-4xl mx-auto">
                        <DiscoverySearchBar initialServiceTypes={initialServiceTypes} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header / Address Selection */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {results ? `${results.total} ${tSearch.results_found}` : tSearch.search_button}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {userToken ? (
                            addresses.length > 0 ? (
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                    <span className="text-sm font-medium text-gray-600 px-2">{tSearch.location}:</span>
                                    <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                                        <SelectTrigger className="w-[250px] bg-white border-gray-200">
                                            <SelectValue placeholder={tSearch.select_address} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {addresses.map(a => (
                                                <SelectItem key={a.address_id} value={a.address_id.toString()}>
                                                    {a.label || a.address_line1}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <Button variant="outline" className="gap-2" onClick={handleAddAddress}>
                                    {tSearch.add_address}
                                </Button>
                            )
                        ) : (
                            <div className="text-sm text-amber-700 bg-amber-50 px-4 py-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {tSearch.guest_location_prompt}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <SearchFiltersSidebar
                            metadata={filtersMetadata}
                            filters={filters}
                            setFilters={setFilters}
                            onApply={handleApplyFilters}
                        />
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 h-64">
                                <Loader2 className="animate-spin w-10 h-10 text-primary mb-4" />
                                <p className="text-gray-500 font-medium">Searching for the best sitters...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {results?.results.map(provider => (
                                    <SitterCard
                                        key={provider.provider_service_id}
                                        provider={provider}
                                        isAuthenticated={!!userToken}
                                        hasAddress={addresses.length > 0}
                                    />
                                ))}
                                {results?.results.length === 0 && (
                                    <div className="text-center p-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                                        <p className="mt-1 text-gray-500">Try adjusting your filters or search criteria.</p>
                                    </div>
                                )}
                                {!results && !loading && (
                                    <div className="text-center p-12 text-gray-500 bg-gray-50 rounded-xl">
                                        Please select a service type to start searching.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
