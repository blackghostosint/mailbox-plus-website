// USPSServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const USPSServices: React.FC = () => {
  const service = services.find(s => s.id === "usps-services")!;
  return <ServicePage {...service} />;
};