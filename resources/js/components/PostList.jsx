import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function PostList(){
  const [posts, setPosts] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){
    try{
      const res = await api.get('/posts');
      const data = res.data || res;
      setPosts(data.data || data);
    }catch(e){}
  }
  return (
    <div className="space-y-4">
      {posts.map(p=>(
        <div key={p.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <Link to={`/posts/${p.id}`} className="font-semibold">{p.title}</Link>
            <span className="text-sm text-gray-500">{p.status}</span>
          </div>
          <div className="text-sm text-gray-600">By {p.author?.name}</div>
          <p className="mt-2 text-sm">{(p.body||'').slice(0,150)}...</p>
        </div>
      ))}
    </div>
  );
}
