"use client";

import { getTransactionsAction } from "@/app/admin/transactions/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { TransactionItem } from "@/services/admin-api";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function TransactionsPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.transactions;
  const isRtl = lang === "fa";

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [source, setSource] = useState("all");
  const [userId, setUserId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const params: any = {
        skip,
        limit,
        source: source === "all" ? undefined : source,
        user_id: userId ? parseInt(userId) : undefined,
        booking_id: bookingId ? parseInt(bookingId) : undefined,
        from_datetime: fromDate ? new Date(fromDate).toISOString() : undefined,
        to_datetime: toDate ? new Date(toDate).toISOString() : undefined,
      };

      const response = await getTransactionsAction(params);
      setTransactions(response.items);
      setTotal(response.total);
    } catch (error) {
      toast.error(t.errorFetch || "Failed to fetch transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, source, userId, bookingId, fromDate, toDate]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.listTitle}</CardTitle>
          <CardDescription>{t.listDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1">
                <span className="text-sm font-medium">{t.source}</span>
                <Select value={source} onValueChange={(v) => { setSource(v); setPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t.source} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allSources}</SelectItem>
                    <SelectItem value="payment">{t.payment}</SelectItem>
                    <SelectItem value="wallet_transaction">{t.walletTransaction}</SelectItem>
                    <SelectItem value="wallet_charge">{t.walletCharge}</SelectItem>
                    <SelectItem value="withdrawal">{t.withdrawal}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">{t.userId}</span>
                <div className="relative w-full max-w-sm items-center">
                  <Input
                    placeholder={t.userId}
                    value={userId}
                    onChange={(e) => { setUserId(e.target.value); setPage(1); }}
                    className="pl-8 w-[150px]"
                    type="number"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">{t.bookingId}</span>
                <div className="relative w-full max-w-sm items-center">
                  <Input
                    placeholder={t.bookingId}
                    value={bookingId}
                    onChange={(e) => { setBookingId(e.target.value); setPage(1); }}
                    className="pl-8 w-[150px]"
                    type="number"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">{t.startDate}</span>
                <Input
                  type="datetime-local"
                  placeholder={t.startDate}
                  value={fromDate}
                  onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                  className="w-auto"
                />
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">{t.endDate}</span>
                <Input
                  type="datetime-local"
                  placeholder={t.endDate}
                  value={toDate}
                  onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                  className="w-auto"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.type}</TableHead>
                  <TableHead>{t.amount}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.direction}</TableHead>
                  <TableHead>{t.summary}</TableHead>
                  <TableHead>{t.createdAt}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         <span>{t.loading || "Loading..."}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {t.noTransactions}
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.transaction_id}>
                      <TableCell>
                        <Badge variant="outline">{tx.transaction_type}</Badge>
                      </TableCell>
                      <TableCell dir="ltr">
                        {tx.amount_minor !== undefined && tx.amount_minor !== null
                          ? (tx.amount_minor).toLocaleString()
                          : "-"} {tx.currency_code}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === "success" || tx.status === "completed" ? "default" : "secondary"}>
                          {tx.status || "-"}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant={tx.direction === "credit" ? "default" : "destructive"}>
                          {tx.direction === "credit" ? t.credit : t.debit}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={tx.summary}>
                        {tx.summary}
                      </TableCell>
                      <TableCell dir="ltr">
                        {new Date(tx.created_at).toLocaleString(lang === "fa" ? "fa-IR" : "en-US")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
               {/* Pagination info could go here */}
               Page {page} of {totalPages || 1}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {/* {t.previous} */}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
              >
                 {/* {t.next} */}
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
