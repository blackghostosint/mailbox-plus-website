import React from "react";
import { motion, type MotionProps } from "framer-motion";

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;

export interface ButtonProps extends BaseButtonProps {
  variant?: "primary" | "secondary" | "link" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  as?: "button" | "div" | "span" | "a";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  as = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  };

  const variantClasses = {
    primary:
      "bg-[#0855B1] text-white hover:bg-[#064A9B] hover:shadow-lg focus:ring-[#B2D3EB] shadow-md",
    secondary:
      "border-2 border-[#0855B1] text-[#0855B1] bg-white hover:bg-[#F0F7FF] hover:border-[#064A9B] hover:shadow-md focus:ring-[#B2D3EB]",
    link:
      "text-[#0855B1] hover:text-[#064A9B] focus:ring-[#B2D3EB] p-0 bg-transparent shadow-none",
    ghost:
      "bg-transparent text-[#0855B1] hover:bg-[#F0F7FF] focus:ring-[#B2D3EB] shadow-none",
  };

  // Define specific motion components to avoid deep type instantiation errors
  const motionComponents = {
    button: motion.button,
    div: motion.div,
    span: motion.span,
    a: motion.a,
  };

  const Component = (motionComponents[as as keyof typeof motionComponents] || motion.button) as any;

  return (
    <Component
      whileHover={{
        scale: variant === "link" || variant === "ghost" ? 1 : 1.03,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: variant === "link" || variant === "ghost" ? 1 : 0.97 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      // Framer Motion's props are complex and require any for proper spreading
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {children}
    </Component>
  );
};
