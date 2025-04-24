import React from "react";

const DiscogsImage = ({ imageUrl, className }) => {
  return (
    <img
      src={imageUrl || "/placeholder.png"}
      alt="Album Art"
      className={className}
    />
  );
};

export default DiscogsImage;
