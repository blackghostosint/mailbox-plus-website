// FedExShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const FedExShipping: React.FC = () => {
  const service = services.find(s => s.id === "fedex-shipping")!;
  return <ServicePage {...service} />;
};