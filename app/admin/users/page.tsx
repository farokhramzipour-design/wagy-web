"use client";

import { getUsersAction } from "@/app/admin/users/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { AdminUser } from "@/services/admin-api";
import { ChevronLeft, ChevronRight, Eye, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function UsersPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.users;
  const isRtl = lang === "fa";

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userType, setUserType] = useState("all");

  // Pagination
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // Reset pagination when filters change
    setSkip(0);
  }, [debouncedSearch, statusFilter, userType]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersAction({
        search: debouncedSearch || undefined,
        status_filter: statusFilter === "all" ? undefined : statusFilter,
        user_type: userType === "all" ? undefined : userType,
        skip,
        limit
      });
      setUsers(response.users);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(t.errorFetch || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, statusFilter, userType, skip, limit]);

  const handlePageChange = (newSkip: number) => {
    if (newSkip >= 0 && newSkip < total) {
      setSkip(newSkip);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "suspended": return "destructive";
      case "pending": return "warning";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.listTitle}</CardTitle>
          <CardDescription>
            {t.listDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${isRtl ? "right-2.5" : "left-2.5"}`} />
              <Input
                placeholder={t.searchPlaceholder}
                className={isRtl ? "pr-8" : "pl-8"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="active">{t.active}</SelectItem>
                  <SelectItem value="suspended">{t.suspended}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t.userType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allTypes}</SelectItem>
                  <SelectItem value="provider">{t.provider}</SelectItem>
                  <SelectItem value="owner">{t.owner}</SelectItem>
                  <SelectItem value="admin">{t.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.user}</TableHead>
                  <TableHead>{t.contact}</TableHead>
                  <TableHead>{t.roles}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-start">{t.createdAt}</TableHead>
                  <TableHead className="text-end">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.loading}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {t.noUsers}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {user.user_id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{user.email}</span>
                          <span className="text-muted-foreground text-left" dir="ltr">{user.phone_e164}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.is_admin && <Badge variant="outline">{t.admin}</Badge>}
                          {user.is_provider && <Badge variant="secondary">{t.provider}</Badge>}
                          {!user.is_admin && !user.is_provider && <Badge variant="outline">{t.user}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {t[user.status] || user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => router.push(`/admin/users/${user.user_id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {t.showing
                .replace("{start}", (users.length > 0 ? skip + 1 : 0).toString())
                .replace("{end}", Math.min(skip + limit, total).toString())
                .replace("{total}", total.toString())}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(skip - limit)}
                disabled={skip === 0 || loading}
              >
                <ChevronLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                {t.previous}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(skip + limit)}
                disabled={skip + limit >= total || loading}
              >
                {t.next}
                <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
