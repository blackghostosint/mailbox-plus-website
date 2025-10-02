// PosterBannerPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PosterBannerPrinting: React.FC = () => {
  const service = services.find(s => s.id === "poster-banner-printing")!;
  return <ServicePage {...service} />;
};