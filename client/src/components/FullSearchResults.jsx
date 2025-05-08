import { useSearchParams, useNavigate } from 'react-router-dom';

function FullSearchResults({ allItems = [] }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const lower = query.toLowerCase();
  const results = allItems.filter(
    (item) =>
      item.description?.toLowerCase().includes(lower) ||
      item.artist?.toLowerCase().includes(lower) ||
      item.genre?.toLowerCase().includes(lower)
  );

  const handleClick = (id) => {
    navigate(`/home/${id}`);
  };

  return (
    <div className='full-search-page'>
      <h2>{results.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}</h2>

      {results.length > 0 && (
        <div className='full-search-content'>
          <div className='full-search-grid'>
            {results.map((item) => (
              <div key={item.id} className='full-search-card' onClick={() => handleClick(item.id)}>
                <img
                  src={
                    item.image_url?.startsWith('http')
                      ? item.image_url
                      : `${import.meta.env.VITE_BACKEND_URL}/public${item.image_url}`
                  }
                  alt={item.description}
                  onError={(e) => (e.target.src = '/placeholder.png')}
                />
                <div className='title'>{item.description || 'Untitled'}</div>
                <div className='artist'>{item.artist || 'Unknown Artist'}</div>
                <div className='genre'>{item.genre || 'Unknown Genre'}</div>
                <div className='price'>{item.price ? `$${item.price}` : 'Not available'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FullSearchResults;
