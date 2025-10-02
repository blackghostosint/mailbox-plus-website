// ProfessionalPacking.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const ProfessionalPacking: React.FC = () => {
  const service = services.find(s => s.id === "professional-packing")!;
  return <ServicePage {...service} />;
};