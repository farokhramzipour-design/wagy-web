import { WizardClient } from "@/components/dashboard/sitter-settings/wizard-client";
import { Metadata } from "next";

interface ServiceWizardPageProps {
  params: {
    serviceId: string;
  };
}

export const metadata: Metadata = {
  title: "Service Wizard | Sitter Settings",
  description: "Complete the details for this service.",
};

export default function ServiceWizardPage({ params }: ServiceWizardPageProps) {
  // Parse the serviceId (which corresponds to service_type_id in our logic)
  const serviceTypeId = parseInt(params.serviceId, 10);

  if (isNaN(serviceTypeId)) {
    return <div>Invalid Service ID</div>;
  }

  return (
    <div className="container">
      <WizardClient serviceId={serviceTypeId} />
    </div>
  );
}
