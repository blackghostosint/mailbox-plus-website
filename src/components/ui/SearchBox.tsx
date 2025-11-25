import React, { useState, useRef, useEffect } from 'react';
import { InternalLink } from './InternalLink';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { services } from '../../config/services';
import { serviceAreas } from '../../config/serviceAreas';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
}

// Transform services into search data
const serviceResults: SearchResult[] = services.map(service => ({
  title: service.serviceName,
  description: service.heroSubtitle || service.metaDescription, // Use subtitle or meta description
  href: service.slug,
  category: service.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) // Format category name
}));

// Transform local pages into search data
const locationResults: SearchResult[] = serviceAreas.map(page => ({
  title: `Shipping & Printing in ${page.city}`,
  description: `Local services for ${page.city}, Ohio`,
  href: page.canonicalUrl,
  category: 'Locations'
}));

const generalResults: SearchResult[] = [
  {
    title: 'Track a Package',
    description: 'Track your FedEx, UPS, USPS, or DHL shipment',
    href: '/tracking',
    category: 'Tools'
  },
  {
    title: 'About Us',
    description: 'Learn more about Mailbox Plus and our team',
    href: '/about-us',
    category: 'Company'
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with us or find our location',
    href: '/contact-us',
    category: 'Company'
  },
  {
    title: 'Shipping Partners',
    description: 'View our carrier partners and shipping options',
    href: '/shipping-partners',
    category: 'Company'
  }
];

const searchData: SearchResult[] = [...serviceResults, ...locationResults, ...generalResults];

export const SearchBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filteredResults = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 results

    setResults(filteredResults);
  }, [query]);

  const handleSearchClick = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <motion.div ref={searchRef} className="relative">
      {/* Search Button/Input */}
      <div className="relative">
        <button
          type="button"
          onClick={handleSearchClick}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls="search-results"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
            isOpen
              ? 'border-[#0855B1] bg-white shadow-lg w-80'
              : 'border-gray-300 bg-white hover:border-[#0855B1] hover:shadow-sm w-48'
          }`}
        >
          <span className="sr-only">
            {isOpen ? 'Focus the service search input' : 'Open service search'}
          </span>
          <Search className="w-4 h-4 text-[#4B5563]" />
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              className="flex-1 outline-none text-sm text-[#111827] placeholder-[#4B5563]"
            />
          ) : (
            <span className="text-sm text-[#4B5563]">Search services...</span>
          )}
          {isOpen && query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3 h-3 text-[#4B5563]" />
            </button>
          )}
        </button>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
            id="search-results"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <InternalLink
                    key={result.href}
                    to={result.href}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-[#F9FAFB] transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#111827] mb-1">
                          {result.title}
                        </h4>
                        <p className="text-xs text-[#4B5563] leading-relaxed">
                          {result.description}
                        </p>
                      </div>
                      <span className="text-xs text-[#0855B1] font-medium ml-3 flex-shrink-0">
                        {result.category}
                      </span>
                    </div>
                  </InternalLink>
                ))}
              </div>
            ) : query.trim() !== '' ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#4B5563]">No services found for "{query}"</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Try searching for shipping, printing, or business services
                </p>
              </div>
            ) : (
              <div className="py-4 px-4">
                <p className="text-sm font-medium text-[#111827] mb-3">Popular Services</p>
                <div className="space-y-2">
                  {searchData.slice(0, 6).map((item) => (
                    <InternalLink
                      key={item.href}
                      to={item.href}
                      onClick={handleResultClick}
                      className="block text-sm text-[#4B5563] hover:text-[#0855B1] transition-colors"
                    >
                      {item.title}
                    </InternalLink>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
