import React, { useState } from 'react';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data || res;
      login(token, user);
      toast.success("Logged in successfully");
      nav('/posts');
    }catch(err){
      toast.error(err.response?.data?.message || 'Login failed');
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
        </div>
      </form>
    </div>
  );
}
