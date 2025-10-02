// PostageStamps.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PostageStamps: React.FC = () => {
  const service = services.find(s => s.id === "postage-stamps")!;
  return <ServicePage {...service} />;
};