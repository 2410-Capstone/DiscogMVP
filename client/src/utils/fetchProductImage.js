// const DISCOGS_TOKEN = import.meta.env.VITE_DISCOGS_TOKEN;

// const fetchProductImage = async (title) => {
//   try {
//     const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(
//       title
//     )}&type=release&token=${DISCOGS_TOKEN}`;

//     const searchResponse = await fetch(searchUrl);
//     const searchData = await searchResponse.json();

//     const firstResult = searchData?.results?.[0];

//     return firstResult?.cover_image || "/placeholder.png";
//   } catch (error) {
//     console.error("Error fetching product image from Discogs:", error);
//     return "/placeholder.png";
//   }
// };

// export default fetchProductImage;
