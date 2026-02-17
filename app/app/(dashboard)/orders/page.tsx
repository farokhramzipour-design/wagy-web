import { cookies } from "next/headers";
import { ShoppingBag } from "lucide-react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function OrdersPage() {
  const lang = (cookies().get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].dashboard.orders;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-800">{t.title}</h1>
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-500">{t.empty}</p>
      </div>
    </div>
  );
}
