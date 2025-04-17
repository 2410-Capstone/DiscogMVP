import React, { useEffect, useState } from "react";

const AlbumArt = ({ releaseId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const DISCOGS_TOKEN = "YOUR_DISCOGS_TOKEN";

  useEffect(() => {
    const fetchAlbumArt = async () => {
      try {
        const response = await fetch(
          `https://api.discogs.com/releases/${releaseId}`,
          {
            headers: {
              Authorization: `Discogs token=${DISCOGS_TOKEN}`,
              "User-Agent": "YourAppName/1.0",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch album data");
        }

        const data = await response.json();

        // Get first image URL from the images array
        if (data.images && data.images.length > 0) {
          setImageUrl(data.images[0].uri);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAlbumArt();
  }, [releaseId]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Album Art"
          style={{ width: "300px", borderRadius: "8px" }}
        />
      ) : (
        <p>No album art available.</p>
      )}
    </div>
  );
};

export default AlbumArt;
