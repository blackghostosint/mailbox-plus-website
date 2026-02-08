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
        <div className="article-content max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Override headings to match design system
                    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-12 mb-6 tracking-tight" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-5 tracking-tight" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-4" {...props} />,

                    // Override paragraph
                    p: ({ node, ...props }) => <p className="text-lg text-slate-700 leading-relaxed mb-6" {...props} />,

                    // Override lists
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 text-slate-700 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-lg leading-relaxed" {...props} />,

                    // Override links
                    a: ({ node, href, children, ...props }) => {
                        const isInternal = href?.startsWith('/');
                        const className = "text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-2";

                        if (isInternal) {
                            return <Link to={href || '#'} className={className} {...props}>{children}</Link>;
                        }
                        return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>{children}</a>;
                    },

                    // Override images
                    img: ({ node, src, alt, ...props }) => {
                        // System should handle R2 paths or local paths. 
                        // If src is provided, SmartImage or standard img can be used.
                        // We wrap it in a container for styling.
                        return (
                            <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-100">
                                <SmartImage
                                    src={src ? getServiceImageUrl(src) : ''}
                                    alt={alt || ''}
                                    className="w-full h-auto object-cover"
                                />
                                {alt && <p className="text-sm text-center text-slate-500 mt-2 italic">{alt}</p>}
                            </div>
                        );
                    },

                    // Bold/Strong
                    strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,

                    // Blockquote
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-6 bg-slate-50 py-2 pr-4 rounded-r-lg" {...props} />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
