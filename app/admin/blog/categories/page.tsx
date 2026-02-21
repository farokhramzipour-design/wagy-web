"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { adminBlogApi } from "@/services/admin-blog-api";
import { BlogCategory } from "@/types/admin-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, FolderTree } from "lucide-react";
import { toast } from "sonner";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const tBlog = (content[lang] as any).admin.blog;
  const t = tBlog.category;
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name_en: "",
    name_fa: "",
    slug: "",
    description: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await adminBlogApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminBlogApi.createCategory(formData);
      toast.success(t.success);
      setOpen(false);
      setFormData({ name_en: "", name_fa: "", slug: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category", error);
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await adminBlogApi.deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <FolderTree className="w-6 h-6" />
            {tBlog.manageCategories}
          </h1>
          <p className="text-neutral-500">{t.list}</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0ea5a4] hover:bg-[#0b7c7b] gap-2">
              <Plus className="w-4 h-4" />
              {t.add}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.add}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.nameEn}</Label>
                <Input 
                  value={formData.name_en} 
                  onChange={e => setFormData({...formData, name_en: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>{t.nameFa}</Label>
                <Input 
                  value={formData.name_fa} 
                  onChange={e => setFormData({...formData, name_fa: e.target.value})}
                  required 
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.slug}</Label>
                <Input 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>{t.description}</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t.save}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.nameEn}</TableHead>
              <TableHead>{t.nameFa}</TableHead>
              <TableHead>{t.slug}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-neutral-500">
                  {t.noCategories}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell className="font-medium">{category.name_en}</TableCell>
                  <TableCell className="font-medium">{category.name_fa}</TableCell>
                  <TableCell className="text-neutral-500">{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(category.category_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
