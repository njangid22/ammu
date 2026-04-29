import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { searchMulti, getImageUrl } from '../services/tmdb';
import type { SearchResult } from '../types/tmdb';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchMulti(val.trim(), 1).then((r) => {
        const filtered = r.results
          .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 8);
        setSuggestions(filtered);
        setShowDropdown(filtered.length > 0);
      }).catch(() => {});
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (item: SearchResult) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/${item.media_type}/${item.id}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar__logo">AMMU</Link>

      <div className="navbar__center">
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/browse/movie" className={`navbar__link ${location.pathname.startsWith('/browse/movie') ? 'active' : ''}`}>Movies</Link>
          <Link to="/browse/tv" className={`navbar__link ${location.pathname.startsWith('/browse/tv') ? 'active' : ''}`}>TV Shows</Link>
        </div>

        <div className="navbar__search-wrap">
          <form onSubmit={handleSearch} className="navbar__search">
            <span className="navbar__search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              className="navbar__search-input"
              placeholder="Search movies, shows..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            />
          </form>

          {showDropdown && (
            <div className="search-dropdown" ref={dropdownRef}>
              {suggestions.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="search-dropdown__item"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <div className="search-dropdown__poster">
                    {item.poster_path ? (
                      <img src={getImageUrl(item.poster_path, 'w92')} alt="" />
                    ) : (
                      <div className="search-dropdown__no-img">🎬</div>
                    )}
                  </div>
                  <div className="search-dropdown__info">
                    <div className="search-dropdown__title">
                      {item.title || item.name}
                    </div>
                    <div className="search-dropdown__meta">
                      <span className="search-dropdown__type">
                        {item.media_type === 'movie' ? '🎬 Movie' : '📺 TV'}
                      </span>
                      {(item.release_date || item.first_air_date) && (
                        <span>{new Date(item.release_date || item.first_air_date || '').getFullYear()}</span>
                      )}
                      {item.vote_average ? (
                        <span>⭐ {item.vote_average.toFixed(1)}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="search-dropdown__all"
                onClick={() => { setShowDropdown(false); navigate(`/search?q=${encodeURIComponent(query)}`); }}
              >
                See all results for "{query}" →
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: 40 }} />
    </nav>
  );
}
