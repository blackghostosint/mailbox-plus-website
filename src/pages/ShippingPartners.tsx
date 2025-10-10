// src/pages/ShippingPartners.tsx
import React from "react";
import { shippingPartners } from "../data/shippingPartners";
import { Meta } from "../components/Meta";

const ShippingPartners: React.FC = () => {
  return (
    <>
      <Meta
        title="Shipping Partners – Mailbox Plus"
        description="Meet the businesses that trust Mailbox Plus for their shipping and logistics needs."
        canonical="https://www.mailboxplus.com/shipping-partners"
      />
      <main className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-8">
          Our Shipping Partners
        </h1>

        {/* Intro Text */}
        <p className="text-center text-lg mb-10 text-gray-600 max-w-2xl mx-auto">
          We're proud to work with a wide range of businesses who trust Mailbox
          Plus for their packing, shipping, and logistics needs.
        </p>

        {/* Partner Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
          {shippingPartners.map((partner) => (
            <a
              key={partner.name}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center group"
            >
              <img
                src={partner.logoUrl}
                alt={`${partner.name} logo`}
                className="h-20 object-contain mb-3 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </main>
    </>
  );
};

export default ShippingPartners;