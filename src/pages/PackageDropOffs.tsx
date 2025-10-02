// PackageDropOffs.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PackageDropOffs: React.FC = () => {
  const service = services.find(s => s.id === "package-drop-offs")!;
  return <ServicePage {...service} />;
};