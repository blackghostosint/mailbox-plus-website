import React from 'react';
import { getServiceImageUrl } from '../lib/storage';
import { SmartImage } from './SmartImage';

export const CarrierLogos: React.FC = React.memo(() => {
  const carriers = [
    {
      name: 'FedEx',
      logo: getServiceImageUrl('fedex-logo.webp'),
      url: 'https://www.fedex.com/',
    },
    {
      name: 'UPS',
      logo: getServiceImageUrl('ups-logo.webp'),
      url: 'https://www.ups.com/',
    },
    {
      name: 'USPS',
      logo: getServiceImageUrl('usps-logo.webp'),
      url: 'https://www.usps.com/',
    },
    {
      name: 'DHL',
      logo: getServiceImageUrl('dhl-logo.webp'),
      url: 'https://www.dhl.com/',
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
          <SmartImage
            src={carrier.logo}
            alt={carrier.name}
            width={200}
            height={64}
            className="h-12 sm:h-16 w-auto object-contain drop-shadow-md aspect-[200/64]"
          />
        </a>
      ))}
    </div>
  );
});
