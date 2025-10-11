import React from "react";

export const CarrierLogos: React.FC = () => {
  const carriers = [
    {
      name: "FedEx",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/fedex-logo.jpg",
      url: "https://www.fedex.com/",
    },
    {
      name: "UPS",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/ups-logo.jpg",
      url: "https://www.ups.com/",
    },
    {
      name: "USPS",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/usps-logo.jpg",
      url: "https://www.usps.com/",
    },
    {
      name: "DHL",
      logo: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/dhl-logo.jpg",
      url: "https://www.dhl.com/",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-10 mb-8 px-4">
      {carriers.map((carrier) => (
        <a
          key={carrier.name}
          href={carrier.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-200 hover:scale-105"
        >
          <img
            src={carrier.logo}
            alt={carrier.name}
            className="h-12 sm:h-16 w-auto object-contain drop-shadow-md"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
};