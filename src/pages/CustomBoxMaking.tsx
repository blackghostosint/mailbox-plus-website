// CustomBoxMaking.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const CustomBoxMaking: React.FC = () => {
  const service = services.find(s => s.id === "custom-box-making")!;
  return <ServicePage {...service} />;
};