import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

const PostOfficeAlternativePage: React.FC = () => {
  const service = services.find(s => s.id === "post-office-alternative-concord-township")!;
  return <ServicePage {...service} />;
};

export default PostOfficeAlternativePage;