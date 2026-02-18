"use client";

import { getUserDetailAction, updateUserStatusAction } from "@/app/admin/users/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import {
  UserDetailResponse
} from "@/services/admin-api";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  XCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.userId);
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.users;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusReason, setStatusReason] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await getUserDetailAction(userId);
      setData(response);
      setNewStatus(response.user.status);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error(t.errorFetch || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUserDetail();
  }, [userId]);

  const handleStatusUpdate = async () => {
    if (!data) return;

    setUpdatingStatus(true);
    try {
      await updateUserStatusAction(userId, newStatus, statusReason);
      toast.success(t.successUpdate || `User status updated to ${newStatus}`);
      setStatusDialogOpen(false);
      fetchUserDetail(); // Refresh data
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(t.errorUpdate || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-semibold">{t.noUsers}</h2>
        <Button onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.goBack}
        </Button>
      </div>
    );
  }

  const { user, provider_profile, bookings_as_owner, bookings_as_provider, conversations } = data;
  const isRtl = lang === "fa";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
          {isRtl ? <ArrowLeft className="h-4 w-4 rotate-180" /> : <ArrowLeft className="h-4 w-4" />}
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{t.detailsTitle}</h1>
        <div className="ms-auto flex gap-2">
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={user.status === "active" ? "destructive" : "default"}>
                {user.status === "active" ? (
                  <>
                    <XCircle className="me-2 h-4 w-4" />
                    {t.suspendUser}
                  </>
                ) : (
                  <>
                    <CheckCircle className="me-2 h-4 w-4" />
                    {t.activateUser}
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.updateStatus}</DialogTitle>
                <DialogDescription>
                  {t.statusDialogDesc}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">{t.status}</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t.active}</SelectItem>
                      <SelectItem value="suspended">{t.suspended}</SelectItem>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">{t.reason}</Label>
                  <Textarea
                    id="reason"
                    placeholder={t.reasonPlaceholder}
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleStatusUpdate} disabled={updatingStatus}>
                  {updatingStatus && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {t.updateStatus}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                {user.is_admin && <Badge variant="outline">{t.admin}</Badge>}
                {user.is_provider && <Badge variant="secondary">{t.provider}</Badge>}
                {!user.is_admin && !user.is_provider && <Badge variant="outline">{t.user}</Badge>}
                <Badge variant={user.status === "active" ? "success" : "destructive"}>
                  {t[user.status] || user.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span dir="ltr" className={isRtl ? "ms-auto" : "me-auto"}>{user.phone_e164}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{t.joined} {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.overview}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                <TabsTrigger value="bookings">{t.bookings}</TabsTrigger>
                {user.is_provider && <TabsTrigger value="provider">{t.providerInfo}</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{t.totalBookings}</CardTitle>
                      <CardDescription>{t.asOwner}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center justify-start">{bookings_as_owner?.length || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{t.conversations}</CardTitle>
                      <CardDescription>{t.activeChats}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center justify-start">{conversations?.length || 0}</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t.recentActivity}</h3>
                  <div className="text-sm text-muted-foreground">
                    {t.noActivity}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="mt-4">
                <h3 className="font-semibold mb-2">{t.bookingHistory}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.bookingHistoryDesc}
                </p>
                {!bookings_as_owner || bookings_as_owner.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t.noBookings}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookings_as_owner.map((booking: any) => (
                      <div key={booking.booking_id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <div className="font-medium">Booking #{booking.booking_id}</div>
                          <div className="text-sm text-muted-foreground">{new Date(booking.created_at).toLocaleDateString()}</div>
                        </div>
                        <Badge>{booking.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {user.is_provider && provider_profile && (
                <TabsContent value="provider" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">{t.businessName}</span>
                      <p>{provider_profile.business_name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">{t.providerStatus}</span>
                      <Badge variant={provider_profile.is_verified ? "success" : "secondary"}>
                        {provider_profile.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">{t.rating}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{provider_profile.rating}</span>
                        <span className="text-muted-foreground">({provider_profile.reviews_count} {t.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">{t.providerBookings}</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{bookings_as_provider?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">{t.totalServed}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
