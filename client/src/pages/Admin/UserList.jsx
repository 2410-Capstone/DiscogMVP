import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const searchRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch users');

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setDeletedUserId(id);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletedUserId(null);
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-inventory">
      <div className="table-wrapper">
        <div className="table-header">
          <h2>User Management</h2>
        </div>

        <div className="table-controls">
          <input
            type="text"
            className="admin-search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={searchRef} 
          />
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.user_role}</td>
                <td>
                  <div className="user-actions">
                    <Link to={`/admin/users/${user.id}/edit`} className="user-delete-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletedUserId === user.id}
                      className="user-delete-btn"
                    >
                      {deletedUserId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
