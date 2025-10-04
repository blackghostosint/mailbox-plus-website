// Insurance.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const Insurance: React.FC = () => {
  const service = services.find(s => s.id === "insurance")!;
  return <ServicePage {...service} />;
};
