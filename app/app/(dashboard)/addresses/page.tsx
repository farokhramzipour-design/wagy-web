import { cookies } from "next/headers";
import { getAddresses } from "@/services/address-api";
import AddressList from "@/components/addresses/address-list";
import AddAddressDialog from "@/components/addresses/add-address-dialog";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default async function AddressesPage() {
  const lang = (cookies().get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].dashboard.addresses;
  const token = cookies().get("waggy_access_token")?.value;

  let addresses: any[] = [];
  try {
    if (token) {
      addresses = await getAddresses(token);
    }
  } catch (error) {
    console.error("Failed to fetch addresses", error);
    // Continue with empty addresses
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">{t.title}</h1>
        <AddAddressDialog t={t} />
      </div>

      <AddressList addresses={addresses} t={t} />
    </div>
  );
}
