import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const PrivateMailboxRentalPage: React.FC = () => {
  const service = services.find(s => s.id === "private-mailbox-rental-concord-township")!;
  return <ServicePage {...service} />;
};

export default PrivateMailboxRentalPage;