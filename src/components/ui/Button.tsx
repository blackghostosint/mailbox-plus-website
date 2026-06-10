import React from 'react';

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'link' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  as?: 'button' | 'div' | 'span' | 'a';
}

/**
 * Performance-optimized Button component.
 * Uses high-performance CSS transitions instead of JS-based animations (like framer-motion)
 * to keep the critical path lean and avoid pulling in large animation libraries on initial load.
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
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const variantClasses = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-lg focus:ring-[var(--color-border-blue)] shadow-md',
    secondary:
      'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-white hover:bg-[var(--color-bg-blue-tint)] hover:border-[var(--color-primary-dark)] hover:shadow-md focus:ring-[var(--color-border-blue)]',
    link: 'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] focus:ring-[var(--color-border-blue)] p-0 bg-transparent shadow-none',
    ghost:
      'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-bg-blue-tint)] focus:ring-[var(--color-border-blue)] shadow-none',
  };

  // Hover and Tap scale effects via CSS
  const interactionClasses =
    variant === 'link' || variant === 'ghost' ? '' : 'hover:scale-[1.03] active:scale-[0.97]';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${interactionClasses} ${className}`;

  // Cast to any to handle dynamic element type correctly with props
  const Component = as as any;

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};
