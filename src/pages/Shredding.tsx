// Shredding.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const Shredding: React.FC = () => {
  const service = services.find(s => s.id === "shredding")!;
  return <ServicePage {...service} />;
};