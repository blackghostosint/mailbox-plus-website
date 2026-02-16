import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

export const BicycleShipping: React.FC = () => {
  const service = services.find(s => s.id === "bicycle-shipping")!;
  return <ServicePageV2 {...service} />;
};
