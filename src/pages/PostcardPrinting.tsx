// PostcardPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const PostcardPrinting: React.FC = () => {
  const service = services.find(s => s.id === "postcard-printing")!;
  return <ServicePage {...service} />;
};