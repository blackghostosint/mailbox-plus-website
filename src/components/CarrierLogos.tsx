import React from "react";

export const CarrierLogos: React.FC = () => {
  const carriers = [
    {
      name: "FedEx",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/fedex-logo.jpg",
    },
    {
      name: "UPS",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/ups-logo.jpg",
    },
    {
      name: "USPS",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/usps-logo.jpg",
    },
    {
      name: "DHL",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/dhl-logo.jpg",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-12 mt-10 mb-6">
      {carriers.map((carrier) => (
        <img
          key={carrier.name}
          src={carrier.logo}
          alt={carrier.name}
          className="h-16 w-auto object-contain drop-shadow-md"
          loading="lazy"
        />
      ))}
    </div>
  );
};