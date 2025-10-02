import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl"
  };

  const variantClasses = {
    primary: "bg-[#0855B1] text-white hover:bg-[#064A9B] focus:ring-[#B2D3EB]",
    secondary: "border-2 border-[#0855B1] text-[#0855B1] bg-white hover:bg-[#F0F7FF] focus:ring-[#B2D3EB]",
    link: "text-[#0855B1] underline underline-offset-4 hover:text-[#064A9B] focus:ring-[#B2D3EB] p-0"
  };

  return (
    <motion.button
      whileHover={{ scale: variant === 'link' ? 1 : 1.02 }}
      whileTap={{ scale: variant === 'link' ? 1 : 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};