import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Meta, JsonLd } from '../components';
import { ArticleMarkdown } from '../components/ArticleMarkdown';
import { articleLoader } from '../utils/articleLoader';
import { Article } from '../types/article.types';
import { Button } from '../components/ui/Button';
import ArrowRight from '~icons/lucide/arrow-right';
import Calendar from '~icons/lucide/calendar';
import Tag from '~icons/lucide/tag';
import User from '~icons/lucide/user';
import { getArticleSchema, getWebPageSchema } from '../utils/schema';
import { siteConfig } from '../config/siteConfig';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-warm)]"></div>
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
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    pubDate,
    author,
    category,
    image,
    relatedServices,
    lastModified,
    keywords,
  } = article.frontmatter;
  const formattedDate = new Date(pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const articleUrl = `https://mailboxplusohio.com/articles/${slug}`;
  const articleSchema = getArticleSchema(siteConfig, {
    headline: title,
    description,
    image,
    datePublished: pubDate,
    dateModified: lastModified ?? pubDate,
    authorName: author,
    articleSection: category,
    keywords: keywords ?? [],
    url: articleUrl,
  });
  const webPageSchema = getWebPageSchema(siteConfig, {
    name: title,
    description,
    url: articleUrl,
    breadcrumbItems: [
      { name: 'Home', url: siteConfig.domain },
      { name: 'Articles', url: `${siteConfig.domain}/articles` },
      { name: title, url: articleUrl },
    ],
  });

  return (
    <>
      <Meta title={title} description={description} canonical={articleUrl} ogImage={image} />
      <JsonLd schema={articleSchema} />
      <JsonLd schema={webPageSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 lg:py-24 text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/25">
            <Tag className="w-4 h-4" />
            <span className="uppercase tracking-wider">{category.replace('-', ' ')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            {title}
          </h1>

          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-10">
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] z-10" />
      </section>

      {/* Content Section */}
      <div className="bg-[var(--color-bg-primary)] py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--color-accent-warm)] hover:prose-a:text-[var(--color-accent-warm-light)] prose-img:rounded-xl prose-img:shadow-lg max-w-none">
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
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                      }}
                      onMouseEnter={(ev) => {
                        ev.currentTarget.style.borderColor = 'var(--color-border-strong)';
                        ev.currentTarget.style.backgroundColor = 'var(--color-accent-warm)/0.08';
                      }}
                      onMouseLeave={(ev) => {
                        ev.currentTarget.style.borderColor = 'var(--color-border)';
                        ev.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="font-semibold group-hover:text-[var(--color-accent-warm)]"
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

          {/* Bottom CTA - Navy Gradient */}
          <div className="mt-20 p-8 bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-deep)] rounded-2xl shadow-xl text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Stop by our location in Concord Township or give us a call. We&apos;re here to help
              with all your shipping and printing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact-us">
                <Button variant="gold" size="lg" className="font-semibold border-none">
                  Contact Us
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="gold-outline" size="lg">
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
