import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', user_role: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data);
        setForm({
          name: data.name || '',
          address: data.address || '',
          user_role: data.user_role || '',
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const confirmUpdate = window.confirm("Are you sure you want to save these changes?");
    if (!confirmUpdate) return;
  
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) throw new Error('Failed to update user');
  
      toast.success("User updated successfully!");
  
      // wait 1.5s then redirect
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    }
  };
  
  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading user...</div>;

  return (
<div className="edit-user-container">
  <Link to="/admin/users" className="back-link">← Back to User List</Link>
  <h2>Edit User</h2>
  <div className="edit-user-card">
    <form onSubmit={handleSubmit} className="edit-user-form">
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select
          name="user_role"
          value={form.user_role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" className="submit-button">Save Changes</button>
    </form>
  </div>
</div>

  );
};

export default EditUser;
