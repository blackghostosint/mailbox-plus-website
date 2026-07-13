import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { getInternalLink, getAnchorText } from '../../utils/internal-links';

interface InternalLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  variant?: 'exact' | 'lsi' | 'geo';
  showIcon?: boolean;
}

export const InternalLink: React.FC<InternalLinkProps> = ({
  to,
  variant = 'exact',
  className = 'text-[var(--color-accent-warm)] hover:underline font-medium',
  children,
  showIcon = false,
  ...props
}) => {
  const location = useLocation();
  // Extract ID from path if possible, or just use the path
  // This is a simplification; ideally we match exact service IDs
  const linkData = getInternalLink(to.split('/').pop() || '');

  const anchor =
    children || (linkData ? getAnchorText(linkData.id, variant, location.pathname) : null);

  if (!anchor) {
    // Fallback for unknown links
    return (
      <Link to={to} className={className} {...props}>
        {to}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={className}
      title={typeof anchor === 'string' ? anchor : undefined}
      {...props}
    >
      {anchor}
      {showIcon && (
        <span aria-hidden="true" className="ml-1">
          →
        </span>
      )}
    </Link>
  );
};
