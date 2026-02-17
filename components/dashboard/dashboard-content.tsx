"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  MessageSquare, 
  Dog, 
  Cat, 
  Star, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

// Mock Data Types
interface Booking {
  id: string;
  sitterName: string;
  sitterAvatar: string;
  serviceType: "Boarding" | "House Sitting" | "Dog Walking" | "Drop-In Visits";
  startDate: string;
  endDate: string;
  status: "upcoming" | "pending" | "completed";
  price: number;
  petName: string;
}

interface Sitter {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  image: string;
  verified: boolean;
}

interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat";
  breed: string;
  image: string;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
}

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    sitterName: "Sarah J.",
    sitterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    serviceType: "Boarding",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    status: "upcoming",
    price: 120,
    petName: "Bella"
  },
  {
    id: "2",
    sitterName: "Mike T.",
    sitterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    serviceType: "Dog Walking",
    startDate: "2024-03-10",
    endDate: "2024-03-10",
    status: "completed",
    price: 25,
    petName: "Max"
  }
];

const MOCK_SITTERS: Sitter[] = [
  {
    id: "1",
    name: "Emily R.",
    rating: 4.9,
    reviews: 124,
    location: "Downtown, 0.5 miles",
    price: 45,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    verified: true
  },
  {
    id: "2",
    name: "David K.",
    rating: 5.0,
    reviews: 89,
    location: "Westside, 2.1 miles",
    price: 35,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    verified: true
  },
  {
    id: "3",
    name: "Jessica L.",
    rating: 4.8,
    reviews: 210,
    location: "North Hills, 3.5 miles",
    price: 40,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    verified: true
  }
];

const MOCK_PETS: Pet[] = [
  {
    id: "1",
    name: "Bella",
    type: "dog",
    breed: "Golden Retriever",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Luna",
    type: "cat",
    breed: "Siamese",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=300&h=300&fit=crop"
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "Sarah J.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    preview: "Can't wait to see Bella this weekend! Do you need me to bring anything specific?",
    time: "2h ago",
    unread: true
  },
  {
    id: "2",
    sender: "Waggy Support",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
    preview: "Your booking with Mike T. has been confirmed.",
    time: "1d ago",
    unread: false
  }
];

interface DashboardContentProps {
  userName?: string;
  isProvider?: boolean;
}

export function DashboardContent({ userName = "Pet Parent", isProvider = false }: DashboardContentProps) {
  const [activeService, setActiveService] = useState("boarding");
  const { lang } = useLanguage();
  const t = content[lang].dashboard.home;
  const tProvider = content[lang].dashboard.overview;

  const serviceTypes = [
    { id: "boarding", label: t.search.services.boarding },
    { id: "houseSitting", label: t.search.services.houseSitting },
    { id: "dogWalking", label: t.search.services.dogWalking },
    { id: "dropIn", label: t.search.services.dropIn }
  ];

  const serviceTypeMap: Record<string, string> = {
    "Boarding": t.search.services.boarding,
    "House Sitting": t.search.services.houseSitting,
    "Dog Walking": t.search.services.dogWalking,
    "Drop-In Visits": t.search.services.dropIn
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Search Section */}
      <section className="relative bg-primary/5 rounded-3xl p-6 md:p-10 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.welcome.replace("{name}", userName)}
            <span className="block text-lg font-normal text-gray-600 mt-2">
              {t.ready}
            </span>
          </h1>
          
          <Card className="mt-8 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {serviceTypes.map((service) => (
                  <Button 
                    key={service.id}
                    variant={activeService === service.id ? "default" : "outline"}
                    onClick={() => setActiveService(service.id)}
                    className="rounded-full text-sm"
                    size="sm"
                  >
                    {service.label}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-semibold uppercase text-gray-500">{t.search.where}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input id="location" placeholder={t.search.zip} className="pl-9" />
                  </div>
                </div>
                
                <div className="md:col-span-5 space-y-1.5">
                  <Label htmlFor="dates" className="text-xs font-semibold uppercase text-gray-500">{t.search.when}</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input id="dates" placeholder={t.search.dates} className="pl-9" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Button className="w-full h-10">
                    <Search className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{t.search.button}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Background Pattern/Illustration Placeholder */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent hidden md:block" />
        <Dog className="absolute -right-6 -bottom-6 h-64 w-64 text-primary/10 rotate-12 hidden md:block" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Bookings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t.upcoming}</h2>
              <Link href="/app/orders" className="text-sm text-primary hover:underline font-medium">{t.viewAll}</Link>
            </div>
            
            <div className="space-y-4">
              {MOCK_BOOKINGS.filter(b => b.status === 'upcoming').map((booking) => (
                <Card key={booking.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {serviceTypeMap[booking.serviceType]}
                              </span>
                              <span className="text-xs text-gray-500">
                                {booking.startDate} - {booking.endDate}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg">{t.stayWith.replace("{sitter}", booking.sitterName)}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {t.for.replace("{pet}", booking.petName)}
                            </p>
                          </div>
                          <img 
                            src={booking.sitterAvatar} 
                            alt={booking.sitterName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 p-5 flex flex-col justify-center gap-2 sm:w-48 border-t sm:border-t-0 sm:border-l border-gray-100">
                        <Button size="sm" className="w-full">{t.messageSitter}</Button>
                        <Button size="sm" variant="outline" className="w-full">{t.modifyBooking}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recommended Sitters */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t.recommended}</h2>
              <Link href="/search" className="text-sm text-primary hover:underline font-medium">{t.seeMore}</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_SITTERS.map((sitter) => (
                <Card key={sitter.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-40 overflow-hidden rounded-t-xl">
                    <img 
                      src={sitter.image} 
                      alt={sitter.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {sitter.verified && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        Verified
                      </div>
                    )}
                    <button className="absolute top-3 left-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{sitter.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {sitter.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">${sitter.price}</div>
                        <div className="text-xs text-gray-500">{t.perNight}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        {sitter.rating}
                      </div>
                      <div className="text-gray-500">
                        {sitter.reviews} {t.reviews}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Messages Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {t.messages}
                {MOCK_MESSAGES.some(m => m.unread) && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {MOCK_MESSAGES.filter(m => m.unread).length} {t.new}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_MESSAGES.map((msg) => (
                <div key={msg.id} className="flex gap-3 items-start group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <img 
                      src={msg.avatar} 
                      alt={msg.sender}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {msg.unread && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className={`text-sm ${msg.unread ? 'font-bold' : 'font-medium'} text-gray-900`}>{msg.sender}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{msg.time}</span>
                    </div>
                    <p className={`text-xs ${msg.unread ? 'text-gray-900 font-medium' : 'text-gray-500'} truncate`}>
                      {msg.preview}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-primary h-8 mt-2">
                {t.viewAllMessages} <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Your Pets Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {t.yourPets}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                  <span className="text-xl leading-none">+</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_PETS.map((pet) => (
                  <div key={pet.id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors cursor-pointer">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{pet.name}</h4>
                      <p className="text-xs text-gray-500">{pet.breed}</p>
                    </div>
                    <div className="ml-auto">
                      {pet.type === 'dog' ? <Dog className="w-4 h-4 text-gray-300" /> : <Cat className="w-4 h-4 text-gray-300" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Provider Center */}
          {isProvider && (
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{tProvider.providerCenter}</CardTitle>
                <CardDescription>{t.provider.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/provider/calendar">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {t.provider.calendar}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/provider/requests">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t.provider.requests}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions / Promo */}
          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">{t.refer.title}</h3>
            <p className="text-primary-foreground/90 text-sm mb-4">
              {t.refer.desc}
            </p>
            <Button variant="secondary" className="w-full font-bold text-primary hover:bg-white/90">
              {t.refer.button}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
