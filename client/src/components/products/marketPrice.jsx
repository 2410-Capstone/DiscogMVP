import React, { useEffect, useState } from "react";

const MarketPrice = ({ releaseId }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!releaseId) return;

    const fetchMarketPrice = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/discogs/releases/${releaseId}/market`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const data = await response.json();
        const lowestPrice = data?.lowest_price;
        setPrice(lowestPrice ? `$${lowestPrice}` : "Not available");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPrice();
  }, [releaseId]);

  if (loading) return <p>Loading market price...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Market Price</h3>
      <p>{price}</p>
    </div>
  );
};

export default MarketPrice;
