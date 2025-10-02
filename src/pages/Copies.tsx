// Copies.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const Copies: React.FC = () => {
  const service = services.find(s => s.id === "copies")!;
  return <ServicePage {...service} />;
};