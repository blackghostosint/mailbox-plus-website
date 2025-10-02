import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const DigitalMailboxRental: React.FC = () => {
  const service = services.find(s => s.id === "digital-mailbox-rental")!;
  return <ServicePage {...service} />;
};
