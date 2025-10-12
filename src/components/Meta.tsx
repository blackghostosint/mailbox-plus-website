import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  schema?: object | object[];
  ogImage?: string;
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
  icbm?: string;
  favicon?: string;
  themeColor?: string;
}

export const Meta: React.FC<MetaProps> = ({
  title,
  description,
  keywords,
  canonical,
  schema,
  ogImage,
  geoRegion,
  geoPlacename,
  geoPosition,
  icbm,
  favicon,
  themeColor
}) => {
  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Geo & Locale meta for local SEO */}
      {geoRegion && <meta name="geo.region" content={geoRegion} />}
      {geoPlacename && <meta name="geo.placename" content={geoPlacename} />}
      {geoPosition && <meta name="geo.position" content={geoPosition} />}
      {icbm && <meta name="ICBM" content={icbm} />}

      {/* Favicons / theme color */}
      {favicon && <link rel="icon" href={favicon} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}

      {/* JSON-LD Structured Data */}
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </Helmet>
  );
};
