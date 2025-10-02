// MailboxRentalPage.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const MailboxRentalPage: React.FC = () => {
  const service = services.find(s => s.id === "mailbox-rental")!;
  return <ServicePage {...service} />;
};