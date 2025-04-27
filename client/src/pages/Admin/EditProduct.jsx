import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await res.json();
        setForm(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(form.price) <= 0 || parseInt(form.stock) < 0) {
      toast.error('Price must be greater than $0 and stock cannot be negative.');
      return;
    }
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      toast.success('Product updated successfully!');
      navigate('/admin/inventory');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully!');
      navigate('/admin/inventory');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user || user.user_role !== 'admin') {
    return <div>Access Denied</div>;
  }

  if (error) return <div>Error: {error}</div>;
  if (!form) return <div>Loading...</div>;

  return (
    <div className="edit-product-container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>
          Artist:
          <input
            type="text"
            name="artist"
            value={form.artist || ''}
            disabled
          />
        </label>

        <label>
          Title:
          <input
            type="text"
            name="description"
            value={form.description || ''}
            disabled
          />
        </label>

        <label>
          Genre:
          <input
            type="text"
            name="genre"
            value={form.genre || ''}
            disabled
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Stock:
          <input
            type="number"
            name="stock"
            value={form.stock || ''}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>

      <button onClick={handleDelete} className="delete-button">
        Delete Product
      </button>

    </div>
  );
};

export default EditProduct;
