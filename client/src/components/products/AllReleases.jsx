import React, { useState } from "react";
import albums from "./products/albums_with_ids";
import ProductCard from "./products/ProductCard";

const AllReleases = () => {
  const [allAlbums] = useState(albums);

  const handleDetailsClick = (id) => {
    console.log("Clicked album ID:", id);

  };

  return (
    <>
      {allAlbums.map((album) => (
        <ProductCard key={album.id} item={album} handleDetailsClick={handleDetailsClick} />
      ))}
    </>
  );
};

export default AllReleases;
