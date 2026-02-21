import { PetForm } from "@/components/pets/pet-form";
import { getPet } from "@/services/pet-api";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("waggy_access_token")?.value;

  if (!accessToken) {
    redirect("/auth/login");
  }

  try {
    const pet = await getPet(params.id, accessToken);

    if (!pet) {
      notFound();
    }

    return (
      <PetForm 
        accessToken={accessToken}
        initialData={pet}
        petId={params.id}
      />
    );
  } catch (error) {
    console.error("Failed to fetch pet", error);
    // If 404, notFound()
    // If 401, redirect to login
    // For now just throw or notFound
    notFound();
  }
}
