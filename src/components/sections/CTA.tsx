import React from "react";
import type { CTA } from "../../types/services";
import { Button } from "../ui";
import { cn } from "../../lib/utils";
import ArrowRight from '~icons/lucide/arrow-right';
import { Link } from "react-router-dom";
// import { InternalLink } from "../ui/InternalLink";

interface Props {
  cta: CTA;
  className?: string;
}

/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    plausible: (_: string, __: { props: Record<string, string | undefined> }) => void;
  }
}
/* eslint-enable no-unused-vars */

export const CTASection: React.FC<Props> = ({ cta, className }) => {
  const {
    title,
    subtitle,
    buttonText,
    buttonLink,
    icon: Icon = ArrowRight,
    bgImage,
    align = "center",
    variant = "brand",
  } = cta;

  const alignment =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center";

  // Basic variants; can be expanded in your design system
  const shell =
    variant === "neutral"
      ? "bg-white border border-gray-200"
      : variant === "ghost"
        ? "bg-transparent border border-[#0855B1]/20"
        : "bg-[#0855B1] text-white"; // brand default

  // Optional: Analytics event handler
  const handleClick = () => {
    if (window.plausible) {
      window.plausible("cta_click", {
        props: {
          page: window.location.pathname,
          title,
          buttonText,
        },
      });
    }
  };

  return (
    <section
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-sm mt-12",
        shell,
        className
      )}
      aria-label="Call to action"
    >
      {bgImage && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="relative px-6 py-12 flex flex-col gap-4 justify-center">
        <div className={cn("flex flex-col gap-3", alignment)}>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-base md:text-lg opacity-90 max-w-2xl">
              {subtitle}
            </p>
          )}
          <div className="mt-4">
            {buttonLink.startsWith("http") ? (
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-block"
              >
                <Button variant={variant === "ghost" ? "ghost" : "primary"} as="div">
                  {buttonText} <Icon size={18} />
                </Button>
              </a>
            ) : (
              <Link
                to={buttonLink}
                onClick={handleClick}
                className="inline-block"
              >
                <Button variant={variant === "ghost" ? "ghost" : "primary"} as="span">
                  {buttonText} <Icon size={18} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};