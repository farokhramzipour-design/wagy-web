import { cookies } from "next/headers";
import { PetForm } from "@/components/pets/pet-form";

export default function AddPetPage() {
  const accessToken = cookies().get("waggy_access_token")?.value;
  
  return (
    <div className="max-w-3xl mx-auto py-6">
       <PetForm accessToken={accessToken} />
    </div>
  );
}
