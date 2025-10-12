import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const service = services.find((s) => s.id === "every-door-direct-mail");

export const EveryDoorDirectMail: React.FC = () => {
  if (!service) {
    return <div>Service not found</div>;
  }
  return <ServicePage {...service} />;
};