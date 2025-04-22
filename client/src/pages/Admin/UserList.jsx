import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [deletedUserId, setDeletedUserId] = useState(null);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletedUserId(null);
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!users.length) return <div>Loading users...</div>;

  return (
    <div className="admin-user-list">
      <h2>User Management</h2>
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.address}</td>
              <td>{user.user_role}</td>
              <td>
                <Link to={`/admin/users/${user.id}/edit`} className="edit-button">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletedUserId === user.id}
                  className="delete-button">
                    {deletedUserId === user.id ? 'Deleting...' : 'Delete'}
                  </button>
              </td>    
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
