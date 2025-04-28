import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Wishlist() {
  const { wishlistId } = useParams(); 
  const [items, setItems] = useState([]);
  const [productIdToAdd, setProductIdToAdd] = useState('');

  useEffect(() => {
    if (wishlistId) {
      fetchWishlist();
    }
  }, [wishlistId]);

  async function fetchWishlist() {
    try {
      const res = await axios.get(`http://localhost:3000/api/wishlists/${wishlistId}`);
      setItems(res.data.items);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }

  async function addProduct() {
    try {
      await axios.post(`http://localhost:3000/api/wishlists/${wishlistId}/items`, {
        productId: productIdToAdd,
      });
      setProductIdToAdd('');
      fetchWishlist(); 
    } catch (err) {
      console.error('Error adding product:', err);
    }
  }

  async function removeProduct(productId) {
    try {
      await axios.delete(`http://localhost:3000/api/wishlists/${wishlistId}/items/${productId}`);
      fetchWishlist();
    } catch (err) {
      console.error('Error removing product:', err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productIdToAdd}
          onChange={(e) => setProductIdToAdd(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button onClick={addProduct} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.product_id}
            className="flex justify-between items-center border-b pb-2"
          >
            <span>{item.product_name || `Product ID: ${item.product_id}`}</span>
            <button
              onClick={() => removeProduct(item.product_id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
