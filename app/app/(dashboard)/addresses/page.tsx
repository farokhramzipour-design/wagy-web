import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function AddressesPage() {
  const lang = (cookies().get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].dashboard.addresses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">{t.title}</h1>
        <Button className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
          <Plus className="w-4 h-4 mr-2" />
          {t.add}
        </Button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-500">{t.empty}</p>
      </div>
    </div>
  );
}
