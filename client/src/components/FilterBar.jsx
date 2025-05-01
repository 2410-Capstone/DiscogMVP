import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// import "../styles/App.css";

const FilterBar = ({ genres, genreFilter, onFilterClick, onAllClick }) => {
  const filterBarRef = useRef(null);



  
  const scrollGenres = (direction) => {
    if (filterBarRef.current) {
      filterBarRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className='filterBarWrapper'>
<button className="scrollBtn" onClick={() => scrollGenres("left")} aria-label="Scroll left">
  <ChevronLeft size={20} strokeWidth={2} />
</button>
      <div className='filterBar' ref={filterBarRef}>
        <button className={`filterButton ${genreFilter.length === 0 ? "active" : ""}`} onClick={onAllClick}>
          All genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`filterButton ${genreFilter.includes(genre) ? "active" : ""}`}
            onClick={() => onFilterClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <button className="scrollBtn" onClick={() => scrollGenres("right")} aria-label="Scroll right">
  <ChevronRight size={20} strokeWidth={2} />
</button>

    </div>
  );
};

export default FilterBar;
