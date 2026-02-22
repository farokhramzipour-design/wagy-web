import { ServicesStep } from "@/components/dashboard/become-sitter/steps/services-step";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { getAvailableServiceTypes, ServiceType } from "@/services/provider-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth/login");
  }

  let serviceTypes: ServiceType[] = [];
  try {
    const response = await getAvailableServiceTypes(token);
    serviceTypes = response.items || [];
  } catch (error) {
    console.error("Failed to fetch service types", error);
  }

  return (
    <div className="container mx-auto py-8">
      <ServicesStep serviceTypes={serviceTypes} />
    </div>
  );
}
