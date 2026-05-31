import React from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * If true, loads image eagerly with high fetch priority (for LCP/hero).
   * Otherwise, loads lazily by default.
   */
  priority?: boolean;
  /**
   * Optionally provide AVIF/WebP sources for responsive images.
   */
  sources?: Array<{
    srcSet: string;
    type: string;
    media?: string;
  }>;
}

/**
 * SmartImage: Responsive, lazy-loading image with AVIF/WebP support.
 * - Use priority for LCP/hero images.
 * - Uses <picture> if sources are provided.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  priority = false,
  sources,
  alt = '',
  ...imgProps
}) => {
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : undefined;
  const decoding = 'async';

  if (sources && sources.length > 0) {
    return (
      <picture>
        {sources.map((source, i) => (
          <source key={i} srcSet={source.srcSet} type={source.type} media={source.media} />
        ))}
        <img
          alt={alt}
          {...imgProps}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
        />
      </picture>
    );
  }

  return (
    <img
      alt={alt}
      {...imgProps}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
    />
  );
};

export default SmartImage;
