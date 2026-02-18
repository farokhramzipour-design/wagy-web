"use client";

import {
  createServiceStepAction,
  deleteServiceStepAction,
  getServiceTypeByIdAction,
  reorderServiceStepsAction,
  updateServiceStepAction,
} from "@/app/admin/services/actions";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ServiceStep, ServiceType } from "@/services/admin-api";
import { ArrowDown, ArrowLeft, ArrowUp, Edit, List, Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function ServiceStepsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.services.stepsPage;
  const tCommon = (content[lang] as any).admin.services.form; // Fallback for common terms if needed
  const isRtl = lang === "fa";
  const serviceId = parseInt(params.id);

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<ServiceType | null>(null);
  const [steps, setSteps] = useState<ServiceStep[]>([]);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ServiceStep | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    step_number: 1,
    title_en: "",
    title_fa: "",
    description: "",
    is_required: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchService = async () => {
    setLoading(true);
    try {
      const data = await getServiceTypeByIdAction(serviceId);
      setService(data);
      // Sort steps by step_number or display_order if available, otherwise by creation or index
      // Assuming the API returns them in order or we should sort them.
      // If we use reorder API, we likely want to sort by index in the array or a specific field.
      // The user mentioned "step_number". Let's assume step_number is the order.
      const sortedSteps = (data.steps || []).sort((a, b) => a.step_number - b.step_number);
      setSteps(sortedSteps);

      // Set next step number
      if (sortedSteps.length > 0) {
        setFormData(prev => ({ ...prev, step_number: sortedSteps[sortedSteps.length - 1].step_number + 1 }));
      }
    } catch (error) {
      console.error("Failed to fetch service:", error);
      toast.error(t.errorFetch || "Failed to fetch service details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const resetForm = () => {
    setFormData({
      step_number: steps.length > 0 ? steps[steps.length - 1].step_number + 1 : 1,
      title_en: "",
      title_fa: "",
      description: "",
      is_required: true,
    });
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await createServiceStepAction(serviceId, formData);
      toast.success(t.form.success || "Step created successfully");
      setIsCreateOpen(false);
      resetForm();
      fetchService();
    } catch (error) {
      console.error("Failed to create step:", error);
      toast.error(t.form.error || "Failed to create step");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentStep) return;
    setSubmitting(true);
    try {
      await updateServiceStepAction(serviceId, currentStep.step_id, formData);
      toast.success(t.form.successUpdate || "Step updated successfully");
      setIsEditOpen(false);
      setCurrentStep(null);
      resetForm();
      fetchService();
    } catch (error) {
      console.error("Failed to update step:", error);
      toast.error(t.form.errorUpdate || "Failed to update step");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteServiceStepAction(serviceId, deleteId);
      toast.success(t.form.successDelete || "Step deleted successfully");
      fetchService();
    } catch (error) {
      console.error("Failed to delete step:", error);
      toast.error(t.form.errorDelete || "Failed to delete step");
    } finally {
      setDeleteId(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    if (direction === "up" && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    } else if (direction === "down" && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    } else {
      return;
    }

    setSteps(newSteps); // Optimistic update

    try {
      const orderedIds = newSteps.map(s => s.step_id);
      await reorderServiceStepsAction(serviceId, orderedIds);
      toast.success(t.reorderSuccess);
      // Ideally we re-fetch to ensure sync, but optimistic is fine for now
    } catch (error) {
      console.error("Failed to reorder steps:", error);
      toast.error(t.reorderError);
      fetchService(); // Revert on error
    }
  };

  const openEdit = (step: ServiceStep) => {
    setCurrentStep(step);
    setFormData({
      step_number: step.step_number,
      title_en: step.title_en,
      title_fa: step.title_fa,
      description: step.description,
      is_required: step.is_required,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/services")}>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">
              {service ? t.subtitle.replace("{serviceName}", isRtl ? service.name_fa : service.name_en) : t.subtitle}
            </p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>
          <Plus className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
          {t.addStep}
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
                  <TableHead className="w-[80px] text-center">{t.stepNumber}</TableHead>
                  <TableHead className="text-start">{t.titleEn}</TableHead>
                  <TableHead className="text-start">{t.titleFa}</TableHead>
                  <TableHead className="text-start">{t.description}</TableHead>
                  <TableHead className="text-center">{t.required}</TableHead>
                  <TableHead className="text-end">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.loading || "Loading..."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : steps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {t.noSteps}
                    </TableCell>
                  </TableRow>
                ) : (
                  steps.map((step, index) => (
                    <TableRow key={step.step_id}>
                      <TableCell className="text-center font-medium">
                        <div className="flex items-center justify-center gap-1">
                          {index + 1}
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
                              disabled={index === steps.length - 1}
                              onClick={() => handleMove(index, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-start">{step.title_en}</TableCell>
                      <TableCell className="text-start">{step.title_fa}</TableCell>
                      <TableCell className="text-start max-w-[200px] truncate" title={step.description}>
                        {step.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={step.is_required ? "default" : "secondary"}>
                          {step.is_required ? t.required : t.optional}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/services/${serviceId}/steps/${step.step_id}/fields`)}
                            title={t.fields || "Fields"}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(step)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(step.step_id)}
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.createTitle}</DialogTitle>
            <DialogDescription>{t.createDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="step_number">{t.form.stepNumber}</Label>
              <Input
                id="step_number"
                type="number"
                value={formData.step_number}
                onChange={(e) => setFormData({ ...formData, step_number: parseInt(e.target.value) || 0 })}
                placeholder={t.form.stepNumberPlaceholder}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title_en">{t.titleEn}</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder={t.form.titleEnPlaceholder}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title_fa">{t.titleFa}</Label>
              <Input
                id="title_fa"
                value={formData.title_fa}
                onChange={(e) => setFormData({ ...formData, title_fa: e.target.value })}
                placeholder={t.form.titleFaPlaceholder}
                dir="rtl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t.form.descPlaceholder}
              />
            </div>
            <div className="flex items-center space-x-2 gap-2">
              <Switch
                id="is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
              />
              <Label htmlFor="is_required">{t.form.isRequired}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t.form.cancel}
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.form.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editTitle}</DialogTitle>
            <DialogDescription>{t.editDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_step_number">{t.form.stepNumber}</Label>
              <Input
                id="edit_step_number"
                type="number"
                value={formData.step_number}
                onChange={(e) => setFormData({ ...formData, step_number: parseInt(e.target.value) || 0 })}
                placeholder={t.form.stepNumberPlaceholder}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_title_en">{t.titleEn}</Label>
              <Input
                id="edit_title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder={t.form.titleEnPlaceholder}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_title_fa">{t.titleFa}</Label>
              <Input
                id="edit_title_fa"
                value={formData.title_fa}
                onChange={(e) => setFormData({ ...formData, title_fa: e.target.value })}
                placeholder={t.form.titleFaPlaceholder}
                dir="rtl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">{t.description}</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t.form.descPlaceholder}
              />
            </div>
            <div className="flex items-center space-x-2 gap-2">
              <Switch
                id="edit_is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
              />
              <Label htmlFor="edit_is_required">{t.form.isRequired}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t.form.cancel}
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.form.update}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash className="h-5 w-5 text-destructive" />
              {t.delete}
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
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
