// PostersPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PostersPrinting: React.FC = () => {
  const service = services.find(s => s.id === "posters-printing")!;
  return <ServicePage {...service} />;
};