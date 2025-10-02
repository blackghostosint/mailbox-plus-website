// FaxServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const FaxServices: React.FC = () => {
  const service = services.find(s => s.id === "fax-services")!;
  return <ServicePage {...service} />;
};