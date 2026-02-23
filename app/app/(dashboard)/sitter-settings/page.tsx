import { SitterSettingsContent } from "@/components/dashboard/sitter-settings-content";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { getSelectedServicesData, SelectedServicesResponse } from "@/services/provider-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SitterSettingsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  let selectedServices: SelectedServicesResponse | null = null;
  
  try {
    selectedServices = await getSelectedServicesData(token);
  } catch (error) {
    console.error("Failed to fetch selected services:", error);
  }

  return (
    <SitterSettingsContent selectedServices={selectedServices} />
  );
}
