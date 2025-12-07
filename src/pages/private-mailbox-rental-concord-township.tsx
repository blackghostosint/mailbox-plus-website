import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

const PrivateMailboxRentalPage: React.FC = () => {
  const service = services.find(s => s.id === "private-mailbox-rental-concord-township")!;
  return <ServicePageV2 {...service} />;
};

export default PrivateMailboxRentalPage;