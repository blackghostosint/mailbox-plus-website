import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";

/**
 * Template for a service wrapper page
 * 
 * Steps to use:
 * 1. Copy this file and rename it (e.g., ArtworkShipping.tsx).
 * 2. Replace the `SERVICE_ID_HERE` with the id from services.ts.
 * 3. Update the component name to match the page (e.g., ArtworkShipping).
 * 4. Add the route in App.tsx with the correct slug.
 */

export const PageWrapperTemplate: React.FC = () => {
  const service = services.find(s => s.id === "SERVICE_ID_HERE")!;

  return <ServicePage {...service} />;
};