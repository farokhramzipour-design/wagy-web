import { SelectServicesForm } from "@/components/dashboard/sitter-settings/select-services-form";
import { getAvailableServiceTypes, getSelectedServicesData } from "@/services/provider-api";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Select Services | Sitter Settings",
  description: "Manage the services you provide as a pet sitter.",
};

export default async function SelectServicesPage() {
  const token = cookies().get("waggy_access_token")?.value;

  // Fetch available service types and current selection in parallel
  const [serviceTypesResponse, selectedServicesResponse] = await Promise.all([
    getAvailableServiceTypes(token),
    getSelectedServicesData(token).catch(() => null), // Handle error gracefully if no selection yet
  ]);

  const serviceTypes = serviceTypesResponse?.items || [];
  const selectedServices = selectedServicesResponse?.items || [];
  
  // Extract selected IDs
  const initialSelectedServiceIds = selectedServices.map(item => item.service_type_id);

  return (
    <div className="container py-8">
      <SelectServicesForm 
        serviceTypes={serviceTypes} 
        initialSelectedServiceIds={initialSelectedServiceIds} 
      />
    </div>
  );
}
