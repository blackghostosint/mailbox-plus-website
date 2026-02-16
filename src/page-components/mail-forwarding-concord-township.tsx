import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

const MailForwardingPage: React.FC = () => {
  const service = services.find(s => s.id === "mail-forwarding-concord-township")!;
  return <ServicePageV2 {...service} />;
};

export default MailForwardingPage;
