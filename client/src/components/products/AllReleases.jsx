import albums from "./albums_with_ids";
import { useState, useEffect } from "react";
import AlbumArt from "./albumArt";

const Allreleases = () => {
  const [allAlbums, setAllAlbums] = useState(albums);

  return (
    <>
      {allAlbums &&
        allAlbums.map((eachAlbum) => (
          <div key={eachAlbum.id}>
            <AlbumArt releaseId={eachAlbum.id} />
          </div>
        ))}
    </>
  );
};

export default Allreleases;
