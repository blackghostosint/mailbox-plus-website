import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { articleLoader } from '../utils/articleLoader';
import { Article } from '../types/article.types';
import { SmartImage } from '../components/SmartImage';
import { getServiceImageUrl } from '../lib/storage';
import Calendar from '~icons/lucide/calendar';
import ArrowRight from '~icons/lucide/arrow-right';
import BookOpen from '~icons/lucide/book-open';

const ArticlesIndex: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await articleLoader.getAllArticles();
        setArticles(data);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Articles & Guides | Mailbox Plus</title>
        <meta
          name="description"
          content="Helpful articles and guides about shipping, printing, and business services in Concord Township, Ohio."
        />
        <link rel="canonical" href="https://mailboxplusohio.com/articles" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-500/30">
            <BookOpen className="w-4 h-4" />
            Articles & Guides
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 font-heading">
            Helpful Resources for Your Shipping & Business Needs
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Expert tips, local guides, and answers to common questions about pack & ship services in
            Lake County, Ohio.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600">No articles available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const { title, description, slug, pubDate, image, imageAlt, category } =
                  article.frontmatter;
                const formattedDate = new Date(pubDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <Link
                    key={slug}
                    to={`/articles/${slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300"
                  >
                    {/* Featured Image */}
                    <div className="relative overflow-hidden aspect-video bg-slate-200">
                      <SmartImage
                        src={getServiceImageUrl(image)}
                        alt={imageAlt || title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase tracking-wide">
                        {category.replace('-', ' ')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={pubDate}>{formattedDate}</time>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors font-heading line-clamp-2">
                        {title}
                      </h2>

                      {/* Description */}
                      <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                        {description}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlesIndex;
