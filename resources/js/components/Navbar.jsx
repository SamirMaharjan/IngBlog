import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar(){
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">Laravel Blog SPA</Link>
        <nav className="flex items-center gap-4">
          <Link to="/posts">Posts</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/tags">Tags</Link>
          {user?.role === 'admin' && <Link to="/users">Users</Link>}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">{user.name}</span>
              <button onClick={()=>{ logout(); nav('/'); }} className="px-3 py-1 border rounded">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
