// DocumentScanning.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const DocumentScanning: React.FC = () => {
  const service = services.find(s => s.id === "document-scanning")!;
  return <ServicePage {...service} />;
};