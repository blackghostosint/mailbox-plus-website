// PackagingSupplies.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PackagingSupplies: React.FC = () => {
  const service = services.find(s => s.id === "packaging-supplies")!;
  return <ServicePage {...service} />;
};