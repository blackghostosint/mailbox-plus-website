// FlyersBrochures.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const FlyersBrochures: React.FC = () => {
  const service = services.find(s => s.id === "flyers-brochures")!;
  return <ServicePage {...service} />;
};