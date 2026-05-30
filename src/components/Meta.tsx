import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';

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
  themeColor?: string;
  robots?: string;
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
  themeColor,
  robots = 'index, follow',
}) => {
  const location = useLocation();
  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  // Logic to determine the final canonical URL
  let finalCanonical = canonical;

  if (!finalCanonical) {
    // Auto-generate from current location
    const pathname = location.pathname;
    // Remove trailing slash if not root
    const cleanPath = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

    finalCanonical = `${siteConfig.domain}${cleanPath}`;
  } else {
    // If relative path provided, prepend domain
    if (finalCanonical.startsWith('/')) {
      finalCanonical = `${siteConfig.domain}${finalCanonical}`;
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:url" content={finalCanonical} />
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
      <link rel="icon" type="image/png" sizes="32x32" href={siteConfig.favicon.icon32} />
      <link rel="icon" type="image/png" sizes="16x16" href={siteConfig.favicon.icon16} />
      <link rel="apple-touch-icon" sizes="180x180" href={siteConfig.favicon.appleTouch} />
      <link rel="icon" type="image/png" sizes="192x192" href={siteConfig.favicon.android192} />
      <link rel="icon" type="image/png" sizes="512x512" href={siteConfig.favicon.android512} />
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
