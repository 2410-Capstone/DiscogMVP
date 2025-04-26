import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import DiscogsImage from '../../components/products/DiscogsImage';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products/all'); 
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = products.filter(
      (product) =>
        product.artist.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
    setFiltered(results);
  };

  const handleSort = () => {
    const sorted = [...filtered].sort((a, b) => 
      sortAsc ? a.price - b.price : b.price - a.price
    );
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of stock';
    if (stock < 5) return 'Low stock';
    return 'In stock';
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <Link to="/admin/products/new" className="add-button">Add Product</Link>
      </div>

      <div className="inventory-controls">
        <input
          type="text"
          placeholder="Search by artist or description..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSort}>
          Sort by Price {sortAsc ? '⬆️' : '⬇️'}
        </button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Artist</th>
            <th>Description</th>
            <th>Genre</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product.id} className="inventory-item">
              <td>
                {product.release_id ? (
                  <img src={product.image_url || "/placeholder.png"} alt="Album Art" className="thumbnail" />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{product.artist}</td>
              <td>{product.description}</td>
              <td>{product.genre}</td>
              <td>${product.price}</td>
              <td style={{ color: product.stock === 0 ? 'red' : 'green' }}>
                {product.stock}
              </td>
              <td>{getStockStatus(product.stock)}</td>
              <td>
                <Link to={`/admin/edit-product/${product.id}`}>
                  <button className="edit-button">Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
