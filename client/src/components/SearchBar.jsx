import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ allItems = [], onCloseSearch }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const mouseLeaveTimeout = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onCloseSearch?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCloseSearch]);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      setActiveIndex(-1);
      return;
    }

    const lower = query.toLowerCase();

    const results = allItems.filter((item) => {
      return (
        item.description?.toLowerCase().includes(lower) ||
        item.artist?.toLowerCase().includes(lower) ||
        item.genre?.toLowerCase().includes(lower)
      );
    });

    setFiltered(results);
    setVisibleCount(5);
    setActiveIndex(-1);
  }, [query, allItems]);

  const handleClick = (id) => {
    onCloseSearch?.();
    setQuery('');
    setFiltered([]);
    navigate(`/home/${id}`);
  };

  const handleLoadMore = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onCloseSearch?.();
  };

  const handleKeyDown = (e) => {
    const maxIndex = Math.min(filtered.length, visibleCount);
    const hasLoadMore = filtered.length > visibleCount;
    const limit = hasLoadMore ? maxIndex : maxIndex - 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < limit ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : limit));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < visibleCount) {
        handleClick(filtered[activeIndex].id);
      } else if (activeIndex === visibleCount && hasLoadMore) {
        handleLoadMore();
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        onCloseSearch?.();
      }
    } else if (e.key === 'Escape') {
      onCloseSearch?.();
      setQuery('');
      setFiltered([]);
    }
  };

  const handleMouseEnter = () => clearTimeout(mouseLeaveTimeout.current);
  const handleMouseLeave = () => {
    mouseLeaveTimeout.current = setTimeout(() => {
      onCloseSearch?.();
    }, 300);
  };

  return (
    <div className='search-wrapper' ref={wrapperRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <input
        ref={inputRef}
        className='search-bar'
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search...'
        autoFocus
      />

      {filtered.length > 0 && (
        <div className='search-section'>
          <p className='search-header'>Suggested works & artists</p>
          {filtered.slice(0, visibleCount).map((item, index) => (
            <div
              key={item.id}
              tabIndex={0}
              className={`search-result-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleClick(item.id)}
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/public${item.image_url}`}
                alt={item.title}
                onError={(e) => (e.target.src = '/placeholder.png')}
                className='search-thumb'
              />
              <div className='result-text'>
                <strong>{item.description}</strong>
                <span>{item.artist ? `${item.artist}` : 'Unknown artist'}</span>
              </div>
            </div>
          ))}

          {filtered.length > visibleCount && (
            <button
              className={`loadmore ${activeIndex === visibleCount ? 'active' : ''}`}
              onClick={handleLoadMore}
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(visibleCount)}
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
