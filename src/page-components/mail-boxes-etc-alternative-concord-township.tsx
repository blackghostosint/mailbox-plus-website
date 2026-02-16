import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

const MailBoxesEtcAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "mail-boxes-etc-alternative-concord-township")!;
  return <ServicePageV2 {...service} />;
};

export default MailBoxesEtcAlternativePage;