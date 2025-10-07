import React from "react";
import { useParams } from "react-router-dom";
import { serviceAreas } from "../config/serviceAreas";
import { ServicePage } from "../components/ServicePage";

export const ServiceAreaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = serviceAreas.find((a) => a.slug === slug);

  if (!area) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Area Not Found</h1>
        <p className="text-gray-600 mt-4">
          Sorry, we don’t have a service area page for this location yet.
        </p>
      </div>
    );
  }

  return <ServicePage {...area} />;
};
