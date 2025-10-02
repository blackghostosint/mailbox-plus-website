// PackageReceiving.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PackageReceiving: React.FC = () => {
  const service = services.find(s => s.id === "package-receiving")!;
  return <ServicePage {...service} />;
};