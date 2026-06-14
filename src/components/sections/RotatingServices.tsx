import React, { useState, useEffect } from 'react';

const serviceCategories = [
  'Pack & Ship Services',
  'Professional Printing',
  'Mailbox Rentals',
  'Document Services',
  'Notary Services',
  'Digital Fingerprinting',
  'Fax & Scan Services',
  'Packaging Supplies',
  'Business Services',
  'Shredding Services',
  'Package Receiving',
  'Copy Services',
  'Drop-off Services',
];

/**
 * RotatingServices Component
 *
 * Performance-optimized component that handles the rotating text on the hero section.
 * By isolating this logic, we prevent the entire Home page from re-rendering every 3 seconds.
 */
export const RotatingServices: React.FC = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [prevServiceIndex, setPrevServiceIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevServiceIndex(currentServiceIndex);
      setCurrentServiceIndex((prev) => (prev + 1) % serviceCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentServiceIndex]);

  return (
    <div className="h-16 mb-8 overflow-hidden relative">
      <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium absolute inset-0 animate-fade-in-up">
        {serviceCategories[currentServiceIndex]}
      </p>
      {prevServiceIndex !== null && (
        <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium absolute inset-0 animate-fade-out-down">
          {serviceCategories[prevServiceIndex]}
        </p>
      )}
    </div>
  );
};
