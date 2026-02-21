import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { getPets, type Pet } from "@/services/pet-api";
import { Edit, Eye, Plus } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

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
            <div key={pet.pet_id} className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full bg-neutral-100">
                {pet.avatar_url ? (
                  <Image
                    src={pet.avatar_url}
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-400">
                    <span className="text-4xl">🐾</span>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                  <h3 className="text-2xl font-bold mb-1">{pet.name}</h3>
                  <p className="text-sm font-medium opacity-90 mb-1">
                    {pet.breed_names?.join(" and ") || "Unknown Breed"}
                  </p>
                  <p className="text-xs opacity-80">
                    {t.details
                      .replace("{years}", (pet.age_years || 0).toString())
                      .replace("{months}", (pet.age_months || 0).toString())
                      .replace("{weight}", (pet.weight_kg || 0).toString())}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center divide-x border-t border-neutral-100">
                <Link
                  href={`/app/pets/${pet.pet_id}/edit`}
                  className="flex flex-1 items-center justify-center py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t.edit}
                </Link>
                <Link
                  href={`/app/pets/${pet.pet_id}`}
                  className="flex flex-1 items-center justify-center py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t.view}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
