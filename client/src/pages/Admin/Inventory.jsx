import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');

  const searchRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }, []);

  const startEditingStock = (productId, currentStock) => {
    setEditingStockId(productId);
    setNewStockValue(currentStock);
  };

  const handleStockSave = async (productId) => {
    if (newStockValue === '') {
      setEditingStockId(null);
      return;
    }

    const parsedStock = parseInt(newStockValue, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      alert('Invalid stock quantity. Must be a non-negative number.');
      setEditingStockId(null);
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...products.find((p) => p.id === productId),
          stock: parsedStock,
        }),
      });

      if (!res.ok) throw new Error('Failed to update stock');
      const updatedProduct = await res.json();

      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, stock: updatedProduct.stock } : product))
      );

      setFiltered((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, stock: updatedProduct.stock } : product))
      );

      setEditingStockId(null);
      setNewStockValue('');
    } catch (err) {
      console.error(err);
      alert('Failed to update stock.');
      setEditingStockId(null);
    }
  };

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
      (product) => product.artist.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
    );
    setFiltered(results);
  };

  const handleSort = () => {
    const sorted = [...filtered].sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of stock';
    if (stock < 5) return 'Low stock';
    return 'In stock';
  };

  if (error) return <div className='error-message'>Error: {error}</div>;
  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className='admin-inventory'>
      <div className='table-wrapper'>
        <div className='table-header'>
          <h2>Inventory</h2>
        </div>

        <div className='table-controls'>
          <input
            type='text'
            placeholder='Search by artist or description...'
            value={searchTerm}
            onChange={handleSearch}
            className='admin-search'
            ref={searchRef}
          />
        </div>

        <Link to='/admin/products/new' className='add-button'>
          Add Product
        </Link>

        <table className='user-table'>
          <thead>
            <tr>
              <th>Date</th>
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
                <td>{new Date(product.created_at).toLocaleDateString()}</td>
                <td>
                  <img
                    src={
                      product.image_url?.startsWith('http')
                        ? product.image_url
                        : `${import.meta.env.VITE_BACKEND_URL}/public${product.image_url}`
                    }
                    alt={product.description}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>{product.artist}</td>
                <td>{product.description}</td>
                <td>{product.genre}</td>
                <td>${product.price}</td>
                <td style={{ color: product.stock === 0 ? 'red' : 'green' }}>
                  {editingStockId === product.id ? (
                    <input
                      type='number'
                      min='0'
                      value={newStockValue}
                      onChange={(e) => setNewStockValue(e.target.value)}
                      onBlur={() => handleStockSave(product.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleStockSave(product.id);
                      }}
                      autoFocus
                      style={{ width: '60px' }}
                    />
                  ) : (
                    <span onClick={() => startEditingStock(product.id, product.stock)} style={{ cursor: 'pointer' }}>
                      {product.stock}
                    </span>
                  )}
                </td>
                <td>{getStockStatus(product.stock)}</td>
                <td>
                  <Link to={`/admin/edit-product/${product.id}`} className='user-edit-btn'>
                    Edit
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
