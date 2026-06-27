import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SmartImage } from './SmartImage';
import { Link } from 'react-router-dom';
import { getServiceImageUrl } from '../lib/storage';

interface ArticleMarkdownProps {
  content: string;
}

export const ArticleMarkdown: React.FC<ArticleMarkdownProps> = ({ content }) => {
  return (
    <div className="article-content max-w-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override headings to match design system
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl md:text-4xl font-bold text-[var(--color-primary-dark)] mt-12 mb-6 tracking-tight font-heading"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-2xl md:text-3xl font-bold text-[var(--color-primary-dark)] mt-10 mb-5 tracking-tight font-heading"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-xl md:text-2xl font-bold text-[var(--color-primary-dark)] mt-8 mb-4 font-heading"
              {...props}
            >
              {children}
            </h3>
          ),

          // Override paragraph
          p: ({ ...props }) => (
            <p
              className="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6"
              {...props}
            />
          ),

          // Override lists
          ul: ({ ...props }) => (
            <ul
              className="list-disc pl-6 mb-6 text-[var(--color-text-primary)] space-y-2"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="list-decimal pl-6 mb-6 text-[var(--color-text-primary)] space-y-2"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="text-lg leading-relaxed" {...props} />,

          // Override links
          a: ({ href, children, ...props }) => {
            const isInternal = href?.startsWith('/');
            const className =
              'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline decoration-[var(--color-border-blue)] underline-offset-2';

            if (isInternal) {
              return (
                <Link to={href || '#'} className={className} {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                {...props}
              >
                {children}
              </a>
            );
          },

          // Override images
          img: ({ src, alt }) => {
            // System should handle R2 paths or local paths.
            // If src is provided, SmartImage or standard img can be used.
            // We wrap it in a container for styling.
            return (
              <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-[var(--color-bg-secondary)]">
                <SmartImage
                  src={src ? getServiceImageUrl(src) : ''}
                  alt={alt || ''}
                  className="w-full h-auto object-cover"
                />
                {alt && (
                  <p className="text-sm text-center text-[var(--color-text-secondary)] mt-2 italic">
                    {alt}
                  </p>
                )}
              </div>
            );
          },

          // Bold/Strong
          strong: ({ ...props }) => (
            <strong className="font-bold text-[var(--color-text-primary)]" {...props} />
          ),

          // Blockquote
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-[var(--color-primary)] pl-4 italic text-[var(--color-text-secondary)] my-6 bg-[var(--color-bg-primary)] py-2 pr-4 rounded-r-lg"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
