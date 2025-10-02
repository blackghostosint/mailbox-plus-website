// UPSAuthorizedShipperOutlet.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const UPSAuthorizedShipperOutlet: React.FC = () => {
  const service = services.find(s => s.id === "ups-shipping")!;
  return <ServicePage {...service} />;
};