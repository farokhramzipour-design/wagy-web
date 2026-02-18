"use client";

import {
  Users,
  Briefcase,
  CreditCard,
  FileBarChart,
  UserPlus,
  Shield,
  ArrowRight,
  TrendingUp,
  Activity,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { SessionData } from "@/lib/session";

const content = { en, fa };

// Role Definitions
type AdminRole = "super_admin" | "admin" | "operator";

interface AdminDashboardProps {
  session: SessionData | null;
  role: AdminRole;
}

export function AdminDashboard({ session, role: rawRole }: AdminDashboardProps) {
  const { lang } = useLanguage();
  
  let role = rawRole as string;
  if (role === "superadmin") role = "super_admin";
  
  // Type-safe translation access
  const tAdmin = (content[lang] as any).admin || {};

  // Mock stats for dashboard overview
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Active Bookings",
      value: "423",
      change: "+5%",
      icon: Briefcase,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+18%",
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Pending Providers",
      value: "28",
      change: "-2%",
      icon: Shield,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 md:p-12 overflow-hidden text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {tAdmin.panelTitle || "Admin Panel"}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {role.replace("_", " ")}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {tAdmin.welcome || "Welcome back,"} {session?.name}
          </h1>
          <p className="text-white/80 text-lg max-w-lg">
            {tAdmin.subtitle || "Manage your platform, users, and services from one central dashboard."}
          </p>
        </div>
        
        {/* Background Pattern */}
        <Shield className="absolute -right-10 -bottom-10 h-80 w-80 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.change.startsWith("+") ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder for Recent Activity or Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full text-gray-400">
            Chart Placeholder
          </CardContent>
        </Card>
        <Card className="h-96">
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full text-gray-400">
            Chart Placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
