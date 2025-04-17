import React, { useEffect, useState } from "react";

const MarketPrice = ({ releaseId }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DISCOGS_TOKEN = "YOUR_DISCOGS_TOKEN"; // replace this with your actual token

  useEffect(() => {
    const fetchMarketPrice = async () => {
      try {
        const response = await fetch(
          `https://api.discogs.com/marketplace/stats/${releaseId}`,
          {
            headers: {
              Authorization: `Discogs token=${DISCOGS_TOKEN}`,
              "User-Agent": "YourAppName/1.0",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const data = await response.json();

        const lowestPrice = data.lowest_price;
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
