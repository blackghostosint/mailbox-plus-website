import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const VirtualMailboxPage: React.FC = () => {
  const service = services.find(s => s.id === "virtual-mailbox-concord-township")!;
  return <ServicePage {...service} />;
};

export default VirtualMailboxPage;