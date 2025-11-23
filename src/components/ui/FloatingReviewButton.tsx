import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

interface FloatingReviewButtonProps {
  imageSrc: string;
  alt?: string;
  link?: string;
  className?: string;
}

const FloatingReviewButton: React.FC<FloatingReviewButtonProps> = ({
  imageSrc,
  alt = "Leave us a Google Review",
  link = "https://g.page/r/CYyNUX4atT3PEBM/review",
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // 1. Scroll Handler
    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClosed(true);
  };

  // Do not render if manually closed by the user
  if (isClosed) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-in-out hidden md:block",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none",
        className
      )}
    >
      <div className="relative group">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-100"
          aria-label="Close review button"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-105 active:scale-95 transition-transform"
        >
          <img
            src={imageSrc}
            alt={alt}
            className="w-36 h-auto drop-shadow-lg"
          />
        </a>
      </div>
    </div>
  );
};

export default FloatingReviewButton;