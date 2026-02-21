"use client";

import { deleteServiceStepFieldAction, getServiceStepFieldsAction, reorderServiceStepFieldsAction } from "@/app/admin/services/actions";
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
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ServiceStepField } from "@/services/admin-api";
import { ArrowDown, ArrowLeft, ArrowUp, List, Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function ServiceStepFieldsPage({ params }: { params: { id: string; stepId: string } }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.services.fieldsPage;
  const isRtl = lang === "fa";
  const serviceId = parseInt(params.id);
  const stepId = parseInt(params.stepId);

  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<ServiceStepField[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const data = await getServiceStepFieldsAction(stepId);
      // Sort by display_order
      const sortedFields = (data || []).sort((a, b) => a.display_order - b.display_order);
      setFields(sortedFields);
    } catch (error) {
      console.error("Failed to fetch fields:", error);
      toast.error(t.errorFetch || "Failed to fetch fields");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    if (direction === "up" && index > 0) {
      // Create copies
      const current = { ...newFields[index] };
      const prev = { ...newFields[index - 1] };

      // Swap display_order
      const tempOrder = current.display_order;
      current.display_order = prev.display_order;
      prev.display_order = tempOrder;

      // Swap positions
      newFields[index] = prev;
      newFields[index - 1] = current;
    } else if (direction === "down" && index < newFields.length - 1) {
      // Create copies
      const current = { ...newFields[index] };
      const next = { ...newFields[index + 1] };

      // Swap display_order
      const tempOrder = current.display_order;
      current.display_order = next.display_order;
      next.display_order = tempOrder;

      // Swap positions
      newFields[index] = next;
      newFields[index + 1] = current;
    } else {
      return;
    }

    setFields(newFields); // Optimistic update

    try {
      const orderedIds = newFields.map(f => f.field_id);
      await reorderServiceStepFieldsAction(stepId, orderedIds);
      toast.success(t.reorderSuccess || "Fields reordered successfully");
    } catch (error) {
      console.error("Failed to reorder fields:", error);
      toast.error(t.reorderError || "Failed to reorder fields");
      fetchFields(); // Revert on error
    }
  };

  useEffect(() => {
    if (stepId) {
      fetchFields();
    }
  }, [stepId]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteServiceStepFieldAction(stepId, deleteId);
      toast.success(t.form.deleteSuccess || "Field deleted successfully");
      fetchFields();
    } catch (error) {
      console.error("Failed to delete field:", error);
      toast.error(t.form.deleteError || "Failed to delete field");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push(`/admin/services/${serviceId}/steps`)}>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/services/${serviceId}/steps/${stepId}/fields/add`)}>
          <Plus className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
          {t.addField}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.listTitle}</CardTitle>
          <CardDescription>{t.listDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">{t.order}</TableHead>
                  <TableHead className="text-start">{t.key}</TableHead>
                  <TableHead className="text-start">{t.labelEn}</TableHead>
                  <TableHead className="text-start">{t.labelFa}</TableHead>
                  <TableHead className="text-center">{t.type}</TableHead>
                  <TableHead className="text-center">{t.required}</TableHead>
                  <TableHead className="text-end">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.loading || "Loading..."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {t.noFields}
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, index) => (
                    <TableRow key={field.field_id}>
                      <TableCell className="text-center font-medium">
                        <div className="flex items-center justify-center gap-1">
                          {field.display_order}
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              disabled={index === 0}
                              onClick={() => handleMove(index, "up")}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              disabled={index === fields.length - 1}
                              onClick={() => handleMove(index, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-start font-mono text-sm">{field.field_key}</TableCell>
                      <TableCell className="text-start">{field.label_en}</TableCell>
                      <TableCell className="text-start">{field.label_fa}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{field.field_type}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={field.is_required ? "default" : "secondary"}>
                          {field.is_required ? (t.required || "Yes") : (t.optional || "No")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          {["select", "multiselect", "radio"].includes(field.field_type) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/services/${serviceId}/steps/${stepId}/fields/${field.field_id}/options`)}
                              title="Manage Options"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/services/${serviceId}/steps/${stepId}/fields/${field.field_id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(field.field_id)}
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
              {t.delete || "Delete"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.form.confirmDelete}
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
              {t.delete || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
