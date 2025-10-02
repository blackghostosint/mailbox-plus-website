// DHLExpress.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const DHLExpress: React.FC = () => {
  const service = services.find(s => s.id === "dhl-express")!;
  return <ServicePage {...service} />;
};
