// InternationalShippingPage.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const InternationalShippingPage: React.FC = () => {
  const service = services.find(s => s.id === "international-shipping")!;
  return <ServicePage {...service} />;
};