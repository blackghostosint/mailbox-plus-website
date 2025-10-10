// Archived on 2025-10-10 — kept for future use, currently not active in the site.
// PrintDocumentServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PrintDocumentServices: React.FC = () => {
  const service = services.find(s => s.id === "print-document-services")!;
  return <ServicePage {...service} />;
};