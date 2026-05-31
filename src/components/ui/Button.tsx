import React from 'react';
import { motion, type MotionProps } from 'framer-motion';

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;

export interface ButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'link' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  as?: 'button' | 'div' | 'span' | 'a';
}

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
  // Map of motion components to avoid deep type instantiation from dynamic lookups
  const MotionComponent: React.ElementType =
    as === 'button'
      ? motion.button
      : as === 'div'
        ? motion.div
        : as === 'span'
          ? motion.span
          : as === 'a'
            ? motion.a
            : motion.button;

  return (
    <MotionComponent
      whileHover={{
        scale: variant === 'link' || variant === 'ghost' ? 1 : 1.03,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: variant === 'link' || variant === 'ghost' ? 1 : 0.97 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      // Framer Motion's props are complex and require proper type assertion
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
