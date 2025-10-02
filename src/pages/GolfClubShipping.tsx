// GolfClubShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const GolfClubShipping: React.FC = () => {
  const service = services.find(s => s.id === "golf-club-shipping")!;
  return <ServicePage {...service} />;
};