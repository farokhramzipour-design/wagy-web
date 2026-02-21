"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { adminBlogApi } from "@/services/admin-blog-api";
import { BlogPost, BlogCategory } from "@/types/admin-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Loader2, FileText, FolderTree } from "lucide-react";
import { toast } from "sonner";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns-jalali";

const content = { en, fa };

export default function BlogPostsPage() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.blog;
  
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, status, categoryId]);

  const fetchCategories = async () => {
    try {
      const data = await adminBlogApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await adminBlogApi.getPosts({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        category_id: categoryId === "all" ? undefined : Number(categoryId),
        skip: (page - 1) * limit,
        limit,
      });
      setPosts(data?.items || []);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.form.deleteConfirm)) return;
    
    try {
      await adminBlogApi.deletePost(id);
      toast.success(t.form.success); // Using general success message or add specific delete success
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error(t.form.error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {t.listTitle}
          </h1>
          <p className="text-neutral-500">{t.listDesc}</p>
        </div>
        <div className="flex gap-2">
           <Link href="/admin/blog/categories">
            <Button variant="outline" className="gap-2">
              <FolderTree className="w-4 h-4" />
              {t.manageCategories}
            </Button>
          </Link>
          <Link href="/admin/blog/create">
            <Button className="bg-[#0ea5a4] hover:bg-[#0b7c7b] gap-2">
              <Plus className="w-4 h-4" />
              {t.addPost}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input 
            placeholder={t.form.titleEn} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </form>
        
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.status}</SelectItem>
            <SelectItem value="published">{t.published}</SelectItem>
            <SelectItem value="draft">{t.draft}</SelectItem>
            <SelectItem value="archived">{t.archived}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.form.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.form.category}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.category_id} value={c.category_id.toString()}>
                {lang === "fa" ? c.name_fa : c.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.postTitle}</TableHead>
              <TableHead>{t.form.category}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.created}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-neutral-400" />
                    <p>{t.noPosts}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.post_id}>
                  <TableCell className="font-medium">
                    {lang === "fa" ? post.title_fa : post.title_en}
                  </TableCell>
                  <TableCell>
                    {post.category_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {t[post.status] || post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {post.created_at ? format(new Date(post.created_at), "yyyy/MM/dd") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/blog/${post.post_id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(post.post_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination (Simple) */}
      <div className="flex justify-end gap-2">
        <Button 
            variant="outline" 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
        >
            Previous
        </Button>
        <Button 
            variant="outline" 
            disabled={page * limit >= total} 
            onClick={() => setPage(p => p + 1)}
        >
            Next
        </Button>
      </div>
    </div>
  );
}
