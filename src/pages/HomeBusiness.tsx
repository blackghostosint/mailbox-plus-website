// HomeBusiness.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const HomeBusiness: React.FC = () => {
  const service = services.find(s => s.id === "home-business")!;
  return <ServicePage {...service} />;
};