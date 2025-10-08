import React from 'react';

interface JsonLdProps {
  schema: object;
}

export const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
};