import { useSearchParams } from "react-router-dom";

function FullSearchResults({ allItems = [] }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const lower = query.toLowerCase();
  const results = allItems.filter(
    (item) =>
      item.title?.toLowerCase().includes(lower) ||
      item.artist?.toLowerCase().includes(lower)
  );

  return (
    <div className="full-search-page">
      <h2>
        {results.length > 0
          ? `Results for "${query}"`
          : `No results for "${query}"`}
      </h2>

      {results.length > 0 && (
        <div className="product-grid">
          {results.map((item) => (
            <div key={item.id} className="product-card">
              <img
                src={
                  item.image_url?.startsWith("http")
                    ? item.image_url
                    : `${import.meta.env.VITE_BACKEND_URL}${item.image_url}`
                }
                alt={item.title}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <div>{item.title}</div>
              <div>{item.artist}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FullSearchResults;
