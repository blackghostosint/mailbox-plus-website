import React from "react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { services } from "../config/services";

const SmallBusinessShippingPage: React.FC = () => {
  const service = services.find(s => s.id === "small-business-shipping-concord-township")!;
  return <ServicePageV2 {...service} />;
};

export default SmallBusinessShippingPage;