"use client";

import { createFieldOptionAction, deleteFieldOptionAction, getServiceStepFieldAction, reorderFieldOptionsAction, updateFieldOptionAction } from "@/app/admin/services/actions";
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
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CreateFieldOptionRequest, FieldOption, ServiceStepField } from "@/services/admin-api";
import { ArrowDown, ArrowLeft, ArrowUp, Check, Edit, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function OptionsPage() {
  const { lang } = useLanguage();
  // Cast to any to avoid strict type checking on deeply nested keys if JSON types aren't perfect
  const t = content[lang as keyof typeof content] as any;
  const params = useParams();
  const serviceId = params.id as string;
  const stepId = params.stepId as string;
  const fieldId = parseInt(params.fieldId as string);

  const [field, setField] = useState<ServiceStepField | null>(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<FieldOption[]>([]);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FieldOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<CreateFieldOptionRequest>({
    value: "",
    label_en: "",
    label_fa: "",
    display_order: 0,
    is_default: false,
    is_active: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const fieldData = await getServiceStepFieldAction(fieldId);
      setField(fieldData);
      setOptions((fieldData.options || []).sort((a, b) => a.display_order - b.display_order));
    } catch (error) {
      toast.error(t.admin.services.fieldsPage.options.noOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fieldId]);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newOptions = [...options];
    if (direction === "up" && index > 0) {
      // Create copies
      const current = { ...newOptions[index] };
      const prev = { ...newOptions[index - 1] };

      // Swap display_order
      const tempOrder = current.display_order;
      current.display_order = prev.display_order;
      prev.display_order = tempOrder;

      // Swap positions
      newOptions[index] = prev;
      newOptions[index - 1] = current;
    } else if (direction === "down" && index < newOptions.length - 1) {
      // Create copies
      const current = { ...newOptions[index] };
      const next = { ...newOptions[index + 1] };

      // Swap display_order
      const tempOrder = current.display_order;
      current.display_order = next.display_order;
      next.display_order = tempOrder;

      // Swap positions
      newOptions[index] = next;
      newOptions[index + 1] = current;
    } else {
      return;
    }

    setOptions(newOptions); // Optimistic update

    try {
      const orderedIds = newOptions.map(o => o.option_id);
      await reorderFieldOptionsAction(fieldId, orderedIds);
      toast.success(t.admin.services.fieldsPage.options.reorderSuccess || "Options reordered successfully");
    } catch (error) {
      console.error("Failed to reorder options:", error);
      toast.error(t.admin.services.fieldsPage.options.reorderError || "Failed to reorder options");
      fetchData(); // Revert on error
    }
  };

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      await createFieldOptionAction(fieldId, formData);
      toast.success(t.admin.services.fieldsPage.options.form.saveSuccess);
      setIsCreateOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(t.admin.services.fieldsPage.options.form.saveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOption) return;
    try {
      setIsSubmitting(true);
      await updateFieldOptionAction(fieldId, selectedOption.option_id, formData);
      toast.success(t.admin.services.fieldsPage.options.form.updateSuccess);
      setIsEditOpen(false);
      setSelectedOption(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(t.admin.services.fieldsPage.options.form.updateError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOption) return;
    try {
      setIsSubmitting(true);
      await deleteFieldOptionAction(fieldId, selectedOption.option_id);
      toast.success(t.admin.services.fieldsPage.options.form.deleteSuccess);
      setIsDeleteOpen(false);
      setSelectedOption(null);
      fetchData();
    } catch (error) {
      toast.error(t.admin.services.fieldsPage.options.form.deleteError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    // Auto-increment order
    const maxOrder = options.length > 0 ? Math.max(...options.map(o => o.display_order)) : 0;
    setFormData(prev => ({ ...prev, display_order: maxOrder + 1 }));
    setIsCreateOpen(true);
  };

  const openEditDialog = (option: FieldOption) => {
    setSelectedOption(option);
    setFormData({
      value: option.value,
      label_en: option.label_en,
      label_fa: option.label_fa,
      display_order: option.display_order,
      is_default: option.is_default,
      is_active: option.is_active,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (option: FieldOption) => {
    setSelectedOption(option);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      value: "",
      label_en: "",
      label_fa: "",
      display_order: 0,
      is_default: false,
      is_active: true,
    });
  };

  if (loading) {
    return <div className="p-8 text-center">{t.admin.services.fieldsPage.options.listDesc}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.admin.services.fieldsPage.options.title}</h1>
          <p className="text-muted-foreground">
            {t.admin.services.fieldsPage.options.subtitle} {field?.label_en} ({field?.field_key})
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/services/${serviceId}/steps/${stepId}/fields`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.admin.services.fieldsPage.form.cancel}
            </Button>
          </Link>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            {t.admin.services.fieldsPage.options.addOption}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.admin.services.fieldsPage.options.listTitle}</CardTitle>
          <CardDescription>{t.admin.services.fieldsPage.options.listDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {options.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.admin.services.fieldsPage.options.noOptions}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">{t.admin.services.fieldsPage.options.order}</TableHead>
                  <TableHead>{t.admin.services.fieldsPage.options.value}</TableHead>
                  <TableHead>{t.admin.services.fieldsPage.options.labelEn}</TableHead>
                  <TableHead>{t.admin.services.fieldsPage.options.labelFa}</TableHead>
                  <TableHead>{t.admin.services.fieldsPage.options.default}</TableHead>
                  <TableHead>{t.admin.services.fieldsPage.options.active}</TableHead>
                  <TableHead className="text-right">{t.admin.services.fieldsPage.options.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option, index) => (
                  <TableRow key={option.option_id}>
                    <TableCell className="text-center font-medium">
                      <div className="flex items-center justify-center gap-1">
                        {option.display_order}
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
                            disabled={index === options.length - 1}
                            onClick={() => handleMove(index, "down")}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{option.value}</TableCell>
                    <TableCell>{option.label_en}</TableCell>
                    <TableCell className="font-iranyekan">{option.label_fa}</TableCell>
                    <TableCell>
                      {option.is_default ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {option.is_active ? (
                        <Badge variant="default" className="bg-green-500">{t.admin.services.fieldsPage.options.active}</Badge>
                      ) : (
                        <Badge variant="secondary">{t.admin.services.services.inactive}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(option)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteDialog(option)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.services.fieldsPage.options.createTitle}</DialogTitle>
            <DialogDescription>{t.admin.services.fieldsPage.options.createDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.admin.services.fieldsPage.options.form.value}</Label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={t.admin.services.fieldsPage.options.form.valuePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.admin.services.fieldsPage.options.form.displayOrder}</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.admin.services.fieldsPage.options.form.labelEn}</Label>
              <Input
                value={formData.label_en}
                onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                placeholder={t.admin.services.fieldsPage.options.form.labelEnPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.admin.services.fieldsPage.options.form.labelFa}</Label>
              <Input
                value={formData.label_fa}
                onChange={(e) => setFormData({ ...formData, label_fa: e.target.value })}
                placeholder={t.admin.services.fieldsPage.options.form.labelFaPlaceholder}
                className="text-right font-iranyekan"
                dir="rtl"
              />
            </div>
            <div className="flex items-center gap-8 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                />
                <Label>{t.admin.services.fieldsPage.options.form.isDefault}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>{t.admin.services.fieldsPage.options.form.isActive}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t.admin.services.fieldsPage.options.form.cancel}
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? t.admin.services.fieldsPage.options.form.save : t.admin.services.fieldsPage.options.form.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.services.fieldsPage.options.editTitle}</DialogTitle>
            <DialogDescription>{t.admin.services.fieldsPage.options.editDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.admin.services.fieldsPage.options.form.value}</Label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={t.admin.services.fieldsPage.options.form.valuePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.admin.services.fieldsPage.options.form.displayOrder}</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.admin.services.fieldsPage.options.form.labelEn}</Label>
              <Input
                value={formData.label_en}
                onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                placeholder={t.admin.services.fieldsPage.options.form.labelEnPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.admin.services.fieldsPage.options.form.labelFa}</Label>
              <Input
                value={formData.label_fa}
                onChange={(e) => setFormData({ ...formData, label_fa: e.target.value })}
                placeholder={t.admin.services.fieldsPage.options.form.labelFaPlaceholder}
                className="text-right font-iranyekan"
                dir="rtl"
              />
            </div>
            <div className="flex items-center gap-8 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                />
                <Label>{t.admin.services.fieldsPage.options.form.isDefault}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>{t.admin.services.fieldsPage.options.form.isActive}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t.admin.services.fieldsPage.options.form.cancel}
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? t.admin.services.fieldsPage.options.form.update : t.admin.services.fieldsPage.options.form.update}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin.services.fieldsPage.options.form.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedOption?.label_en}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin.services.fieldsPage.options.form.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t.admin.services.fieldsPage.options.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
