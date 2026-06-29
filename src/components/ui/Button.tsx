import React from 'react';

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'gold' | 'gold-outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  as?: 'button' | 'div' | 'span' | 'a';
}

/**
 * Two-tone CTA button system.
 *
 * - variant="primary"  → terracotta filled (for warm paper / light backgrounds)
 * - variant="secondary" → terracotta outlined
 * - variant="gold"     → gold filled (for navy / dark backgrounds)
 * - variant="gold-outline" → gold outlined (for navy / dark backgrounds)
 * - variant="ghost"    → transparent, terracotta hover
 * - variant="link"     → inline text link, terracotta color
 *
 * Uses CSS transitions — no animation libraries needed.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  as = 'button',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-[15px] rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const variantClasses = {
    /* Terracotta — for CTAs on warm paper / light backgrounds */
    primary:
      'bg-[var(--color-accent-warm)] text-white hover:bg-[var(--color-accent-warm-light)] shadow-md hover:shadow-lg focus:ring-[var(--color-border-strong)]',
    secondary:
      'border-2 border-[var(--color-accent-warm)] text-[var(--color-accent-warm)] bg-transparent hover:bg-[var(--color-accent-warm)]/10 hover:shadow-md focus:ring-[var(--color-border-strong)]',

    /* Gold — for CTAs on navy / dark backgrounds */
    gold: 'bg-[var(--color-accent-gold)] text-[var(--color-primary-deep)] hover:shadow-[0_0_24px_rgba(247,200,42,0.35)] focus:ring-[var(--color-accent-gold)]/30 shadow-md',
    'gold-outline':
      'border-2 border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] bg-transparent hover:bg-[var(--color-accent-gold)]/10 focus:ring-[var(--color-accent-gold)]/30',

    /* Ghost — transparent with warm hover tint */
    ghost:
      'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm)]/10 focus:ring-[var(--color-border-strong)] shadow-none',

    /* Link — inline text style */
    link: 'text-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm-light)] focus:ring-[var(--color-border-strong)] p-0 bg-transparent shadow-none underline underline-offset-4',
  };

  // Hover and tap scale effects via CSS (skip for link and ghost)
  const interactionClasses =
    variant === 'link' || variant === 'ghost' ? '' : 'hover:scale-[1.03] active:scale-[0.97]';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${interactionClasses} ${className}`;

  // Cast to ElementType to handle dynamic element type correctly with props
  const Component = as as React.ElementType;

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};
