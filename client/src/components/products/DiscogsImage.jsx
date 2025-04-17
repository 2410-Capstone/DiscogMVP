import React, { useState, useEffect } from "react";

const DISCOGS_TOKEN = "YOUR_DISCOGS_TOKEN"; // Replace with actual token

const DiscogsImage = ({ releaseId, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!releaseId) return;

    const fetchAlbumArt = async () => {
      try {
        const res = await fetch(`https://api.discogs.com/releases/${releaseId}`, {
          headers: {
            Authorization: `Discogs token=${DISCOGS_TOKEN}`,
            "User-Agent": "DiscogMVP/1.0",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch image");

        const data = await res.json();
        setImageUrl(data?.images?.[0]?.uri || null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAlbumArt();
  }, [releaseId]);

  if (error) return <p style={{ color: "red" }}>Error loading art</p>;

  return (
    <img
      src={imageUrl || "/placeholder.png"}
      alt="Album Art"
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/placeholder.png";
      }}
    />
  );
};

export default DiscogsImage;
