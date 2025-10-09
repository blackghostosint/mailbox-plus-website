// HomeBusiness.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

export const HomeBusiness: React.FC = () => {
  console.log('HomeBusiness: services array:', services);
  const service = services.find(s => s.id === "home-business");
  console.log('HomeBusiness: found service:', service);
  if (!service) {
    console.error('HomeBusiness: No service found with id "home-business"');
    return <div>Error: Service not found</div>;
  }
  return <ServicePage {...service} />;
};