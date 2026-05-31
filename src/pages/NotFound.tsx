import React from 'react';
import { InternalLink } from '../components/ui/InternalLink';
import { motion } from 'framer-motion';
import Home from '~icons/lucide/home';
import ArrowLeft from '~icons/lucide/arrow-left';
import { Button } from '../components/ui';

export const NotFound: React.FC = () => {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <div className="text-9xl font-bold text-[var(--color-primary)] mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-6">
            Page Not Found
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been
            moved, deleted, or you may have entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink to="/">
              <Button size="lg" className="group">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Go Home
              </Button>
            </InternalLink>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.history.back()}
              className="group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 p-6 bg-[var(--color-bg-primary)] rounded-2xl">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
              Need Help Finding Something?
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Visit our main pages or contact us directly:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <InternalLink to="/services" className="text-[var(--color-primary)] hover:underline">
                Services
              </InternalLink>
              <InternalLink to="/pack-ship" className="text-[var(--color-primary)] hover:underline">
                Pack & Ship
              </InternalLink>
              <InternalLink
                to="/copy-print"
                className="text-[var(--color-primary)] hover:underline"
              >
                Copy & Print
              </InternalLink>
              <InternalLink to="/tracking" className="text-[var(--color-primary)] hover:underline">
                Tracking
              </InternalLink>
              <InternalLink
                to="/contact-us"
                className="text-[var(--color-primary)] hover:underline"
              >
                Contact Us
              </InternalLink>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
