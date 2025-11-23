import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const MailBoxesEtcAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "mail-boxes-etc-alternative-concord-township")!;
  return <ServicePage {...service} />;
};

export default MailBoxesEtcAlternativePage;