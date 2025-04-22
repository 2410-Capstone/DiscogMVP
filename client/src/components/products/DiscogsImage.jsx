import React, { useState, useEffect } from "react";

const DiscogsImage = ({ releaseId, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!releaseId || isNaN(releaseId)) {
      setError("Invalid release ID");
      return;
    }

    const fetchAlbumArt = async () => {
      try {
        const res = await fetch(`/api/discogs/release/${releaseId}`);
        if (!res.ok) throw new Error("Failed to fetch image from Discogs");

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
      src={imageUrl || '/placeholder.png'}
      alt="Album Art"
      className={className}
    />

  );
};

export default DiscogsImage;
