import React, { useState, useRef, useEffect } from 'react';
import { InternalLink } from './InternalLink';
import Search from '~icons/lucide/search';
import X from '~icons/lucide/x';
import type { SearchResult } from '../../utils/search-loader';

export const SearchBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchData, setSearchData] = useState<SearchResult[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
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

  // Load search data only when needed
  useEffect(() => {
    if (isOpen && searchData.length === 0 && !isLoadingData) {
      setIsLoadingData(true);
      import('../../utils/search-loader')
        .then((module) => {
          setSearchData(module.getSearchData());
          setIsLoadingData(false);
        })
        .catch((err) => {
          console.error('Failed to load search data:', err);
          setIsLoadingData(false);
        });
    }
  }, [isOpen, searchData.length, isLoadingData]);

  useEffect(() => {
    if (query.trim() === '' || searchData.length === 0) {
      setResults([]);
      return;
    }

    const filteredResults = searchData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 results

    setResults(filteredResults);
  }, [query, searchData]);

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
    <div ref={searchRef} className="relative">
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
              ? 'border-[var(--color-primary)] bg-white shadow-lg w-80'
              : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-sm w-48'
          }`}
        >
          <span className="sr-only">
            {isOpen ? 'Focus the service search input' : 'Open service search'}
          </span>
          <Search className="w-4 h-4 text-[var(--color-text-secondary)]" />
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
              className="flex-1 outline-none text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
            />
          ) : (
            <span className="text-sm text-[var(--color-text-secondary)]">Search services...</span>
          )}
          {isOpen && query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3 h-3 text-[var(--color-text-secondary)]" />
            </button>
          )}
        </button>
      </div>

      {/* Search Results Dropdown */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--color-border)] rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        id="search-results"
      >
        {isLoadingData ? (
          <div className="py-8 text-center">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs text-[var(--color-text-secondary)]">Initializing search...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="py-2">
            {results.map((result) => (
              <InternalLink
                key={result.href}
                to={result.href}
                onClick={handleResultClick}
                className="block px-4 py-3 hover:bg-[var(--color-bg-primary)] transition-colors border-b border-[var(--color-border)] last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                      {result.title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--color-primary)] font-medium ml-3 flex-shrink-0">
                    {result.category}
                  </span>
                </div>
              </InternalLink>
            ))}
          </div>
        ) : query.trim() !== '' ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              No services found for &quot;{query}&quot;
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Try searching for shipping, printing, or business services
            </p>
          </div>
        ) : (
          <div className="py-4 px-4">
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
              Popular Services
            </p>
            <div className="space-y-2">
              {searchData.slice(0, 6).map((item) => (
                <InternalLink
                  key={item.href}
                  to={item.href}
                  onClick={handleResultClick}
                  className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {item.title}
                </InternalLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
