"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { adminCharityApi } from "@/services/admin-charity-api";
import { CharityCaseSummary } from "@/types/charity";
import { format } from "date-fns-jalali";
import { Edit, Heart, List, Loader2, Plus, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function CharityCasesPage() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity;

  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<CharityCaseSummary[]>([]);

  // Filters
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchCases();
  }, [page]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await adminCharityApi.getMineCases({
        skip: (page - 1) * limit,
        limit,
      });
      setCases(data || []);
    } catch (error) {
      console.error("Failed to fetch cases", error);
      toast.error(t.noCases);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "funded": return "success"; // You might need to add success variant or use custom class
      case "pending_review": return "warning";
      case "draft": return "secondary";
      case "closed": return "outline";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            {t.listTitle}
          </h1>
          <p className="text-neutral-500">{t.listDesc}</p>
        </div>
        <Link href="/app/charity/create">
          <Button className="bg-[#0ea5a4] hover:bg-[#0b7c7b] gap-2">
            <Plus className="w-4 h-4" />
            {t.addCase}
          </Button>
        </Link>
      </div>

      {/* Filters removed as per requirement */}

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.caseTitle}</TableHead>
              <TableHead>{t.target}</TableHead>
              <TableHead>{t.collected}</TableHead>
              <TableHead>{t.progress}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.created}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
                </TableCell>
              </TableRow>
            ) : cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Heart className="w-8 h-8 text-neutral-400" />
                    <p>{t.noCases}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              cases.map((item) => (
                <TableRow key={item.charity_case_id}>
                  <TableCell className="font-medium">
                    <div>{item.title}</div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(item.target_amount_minor)} {item.currency_code}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(item.collected_amount_minor)}
                  </TableCell>
                  <TableCell>
                    {item.progress_percent}%
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status) as any}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500">
                    {item.created_at ? format(new Date(item.created_at), "yyyy/MM/dd") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/app/charity/${item.charity_case_id}/updates`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#0ea5a4] hover:text-[#0b7c7b] hover:bg-[#0ea5a4]/5" title={t.viewUpdates || "View Updates"}>
                          <List className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/app/charity/${item.charity_case_id}/update`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#0ea5a4] hover:text-[#0b7c7b] hover:bg-[#0ea5a4]/5" title={t.addUpdate}>
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/app/charity/${item.charity_case_id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 hover:text-neutral-900" title={t.edit}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
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
