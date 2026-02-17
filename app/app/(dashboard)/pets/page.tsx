import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Dog, Cat } from "lucide-react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { getPets, type Pet } from "@/services/pet-api";

const content = { en, fa };

export default async function PetsPage() {
  const lang = (cookies().get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].dashboard.pets;
  const accessToken = cookies().get("waggy_access_token")?.value;

  let pets: Pet[] = [];
  if (accessToken) {
    try {
      pets = await getPets(accessToken);
    } catch (e) {
      console.error("Failed to fetch pets", e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">{t.title}</h1>
        <Button asChild className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
          <Link href="/app/pets/add">
            <Plus className="w-4 h-4 mr-2" />
            {t.add}
          </Link>
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-neutral-500">{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <div key={pet.pet_id} className="p-6 border border-neutral-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                  {pet.type.toLowerCase() === 'cat' ? <Cat className="w-6 h-6" /> : <Dog className="w-6 h-6" />}
                </div>
                <div className="px-2 py-1 bg-neutral-100 rounded text-xs font-medium text-neutral-600 uppercase">
                  {pet.type}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-neutral-800 mb-1">{pet.name}</h3>
              <p className="text-sm text-neutral-500 mb-4">{pet.breed_name}</p>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <span className="text-neutral-400 block text-xs">{t.list.gender}</span>
                  <span className="text-neutral-700 font-medium capitalize">{pet.gender}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-xs">{t.list.age}</span>
                  <span className="text-neutral-700 font-medium">{pet.age_display}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
