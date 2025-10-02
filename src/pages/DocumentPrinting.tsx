// DocumentPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const DocumentPrinting: React.FC = () => {
  const service = services.find(s => s.id === "document-printing")!;
  return <ServicePage {...service} />;
};