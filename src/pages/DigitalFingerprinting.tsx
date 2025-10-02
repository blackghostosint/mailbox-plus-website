// DigitalFingerprinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const DigitalFingerprinting: React.FC = () => {
  const service = services.find(s => s.id === "digital-fingerprinting")!;
  return <ServicePage {...service} />;
};