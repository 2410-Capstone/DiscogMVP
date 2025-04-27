import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



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
        setError(err.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
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

  if (error) return <div className="error-message">Error: {error}</div>;
  if (loading) return <div>Loading inventory...</div>;  

  return (
    <div className="admin-inventory">
      <div className="inventory-header">
        <h2>Inventory</h2>
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

      <div className="inventory-table-wrapper">
        <table className="admin-table">
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
              <tr key={product.id}>
              <td data-label="Image">
                {product.image_url ? (
                  <img src={product.image_url} alt="Album Art" className="thumbnail" />
                ) : (
                  <img src="/placeholder.png" alt="Placeholder" className="thumbnail" />
                )}
              </td>
                <td data-label="Artist">{product.artist}</td>
                <td data-label="Description">{product.description}</td>
                <td data-label="Genre">{product.genre}</td>
                <td data-label="Price">${product.price}</td>
                <td data-label="Stock" style={{ color: product.stock === 0 ? 'red' : 'green' }}>
                  {product.stock}
                </td>
                <td data-label="Status">{getStockStatus(product.stock)}</td>
                <td data-label="Edit">
                  <Link to={`/admin/edit-product/${product.id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
