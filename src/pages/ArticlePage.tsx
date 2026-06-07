import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArticleMarkdown } from '../components/ArticleMarkdown';
import { articleLoader } from '../utils/articleLoader';
import { Article } from '../types/article.types';
import { SmartImage } from '../components/SmartImage';
import { Button } from '../components/ui/Button';
import ArrowRight from '~icons/lucide/arrow-right';
import Calendar from '~icons/lucide/calendar';
import Tag from '~icons/lucide/tag';
import User from '~icons/lucide/user';
import { getServiceImageUrl } from '../lib/storage';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // Try to find by slug directly
        const data = await articleLoader.getArticleBySlug(slug);

        if (data) {
          setArticle(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Article Not Found
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          The article you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const { title, description, pubDate, author, category, image, imageAlt, relatedServices } =
    article.frontmatter;
  const formattedDate = new Date(pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{title} | Mailbox Plus</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://mailboxplusohio.com/articles/${slug}`} />
      </Helmet>

      {/* Hero Section */}
      <div
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{ backgroundColor: 'var(--color-text-primary)' }}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <SmartImage
            src={getServiceImageUrl(image)}
            alt={imageAlt || title}
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to top, var(--color-text-primary), color-mix(in srgb, var(--color-text-primary) 80%, transparent), transparent)',
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-500/30">
            <Tag className="w-3 h-3" />
            <span className="uppercase tracking-wider">{category.replace('-', ' ')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            {title}
          </h1>

          <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
            {description}
          </p>

          <div
            className="flex items-center justify-center gap-6 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            {author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {author}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:shadow-lg max-w-none">
            <ArticleMarkdown content={article.content} />
          </div>

          {/* Related Services / CTA */}
          {relatedServices && relatedServices.length > 0 && (
            <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--color-border)' }}>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Related Services
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedServices.map((servicePath, idx) => (
                  <Link key={idx} to={servicePath}>
                    <div
                      className="group p-6 rounded-xl transition-all duration-300 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                      }}
                      onMouseEnter={(ev) => {
                        ev.currentTarget.style.borderColor = 'var(--color-border-blue)';
                        ev.currentTarget.style.backgroundColor = 'var(--color-bg-blue-tint)';
                      }}
                      onMouseLeave={(ev) => {
                        ev.currentTarget.style.borderColor = 'var(--color-border)';
                        ev.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="font-semibold group-hover:text-blue-700"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {servicePath
                            .split('/')
                            .pop()
                            ?.replace(/-/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase()) || 'View Service'}
                        </span>
                        <ArrowRight
                          className="w-5 h-5 transition-transform group-hover:translate-x-1"
                          style={{ color: 'var(--color-text-muted)' }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-20 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Stop by our location in Concord Township or give us a call. We&apos;re here to help
              with all your shipping and printing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact-us">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto font-semibold border-none">
                  Contact Us
                </Button>
              </Link>
              <Link to="/services">
                <Button className="bg-transparent border border-blue-400/50 text-white hover:bg-blue-600/50 w-full sm:w-auto">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
