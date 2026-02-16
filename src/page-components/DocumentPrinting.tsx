// DocumentPrinting.tsx
import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

export const DocumentPrinting: React.FC = () => {
  const service = services.find(s => s.id === "document-printing")!;
  return <ServicePageV2 {...service} />;
};