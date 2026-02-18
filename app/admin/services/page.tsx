"use client";

import { deleteServiceTypeAction, getServiceTypesAction } from "@/app/admin/services/actions";
import { useLanguage } from "@/components/providers/language-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_BASE_URL } from "@/lib/api-client";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ServiceType } from "@/services/admin-api";
import { Edit, ListOrdered, Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function ServicesPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.services;
  const isRtl = lang === "fa";

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getServiceTypesAction();
      setServices(response.items);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast.error(t.errorFetch || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteServiceTypeAction(deleteId);
      toast.success(t.form.successDelete);
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error(t.form.errorDelete);
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button onClick={() => router.push("/admin/services/new")}>
          <Plus className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
          {t.addService}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.listTitle}</CardTitle>
          <CardDescription>
            {t.listDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.icon}</TableHead>
                  <TableHead className="text-start">{t.nameEn}</TableHead>
                  <TableHead className="text-start">{t.nameFa}</TableHead>
                  <TableHead className="text-center">{t.totalProviders}</TableHead>
                  <TableHead className="text-center">{t.status}</TableHead>
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
                ) : services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {t.noServices}
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.service_type_id}>
                      <TableCell>
                        {service.icon_url ? (
                          <img
                            src={service.icon_url.startsWith("http") ? service.icon_url : `${API_BASE_URL}${service.icon_url}`}
                            alt={service.name_en}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-muted rounded-full" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-start">
                        {service.name_en}
                      </TableCell>
                      <TableCell className="font-medium text-start">
                        {service.name_fa}
                      </TableCell>
                      <TableCell className="text-center">
                        {service.total_providers}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={service.is_active ? "success" : "secondary"}>
                          {service.is_active ? t.active : t.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/services/${service.service_type_id}/steps`)}
                          >
                            <ListOrdered className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                            {t.steps}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/services/${service.service_type_id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(service.service_type_id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash className="h-5 w-5 text-destructive" />
              {t.delete}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.form.confirmDelete}
              {deleteId && services.find((s) => s.service_type_id === deleteId) && (
                <div className="mt-2 p-3 bg-muted rounded-md font-medium text-foreground text-center">
                  {isRtl
                    ? services.find((s) => s.service_type_id === deleteId)?.name_fa
                    : services.find((s) => s.service_type_id === deleteId)?.name_en}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.form.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
