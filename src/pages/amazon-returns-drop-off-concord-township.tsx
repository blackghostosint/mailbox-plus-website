import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const AmazonReturnsPage: React.FC = () => {
  const service = services.find(s => s.id === "amazon-returns-drop-off-concord-township")!;
  return <ServicePage {...service} />;
};

export default AmazonReturnsPage;