import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PostForm(){
  const { id } = useParams();
  const { token } = useAuth();
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category_id, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(()=>{ loadCategories(); if(id) loadPost(); }, []);
  async function loadCategories(){ try{ const res = await api.get('/categories'); setCategories(res.data.data || res.data || []); }catch(e){} }
  async function loadPost(){ try{ const res = await api.get(`/posts/${id}`); const data = res.data || res; setTitle(data.title); setBody(data.body); setCategoryId(data.category?.id || ''); setTags((data.tags||[]).map(t=>t.name).join(',')); }catch(e){} }

  async function submit(e){
    e.preventDefault();
    try{
      const payload = { title, body, category_id: category_id||null, tags: tags.split(',').map(s=>s.trim()).filter(Boolean) };
      if(id) await api.put(`/posts/${id}`, payload);
      else await api.post('/posts', payload);
      nav('/posts');
    }catch(err){ alert('Failed to save'); }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Post' : 'New Post'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <textarea className="w-full p-2 border rounded h-40" value={body} onChange={e=>setBody(e.target.value)} placeholder="Body" />
        <div className="grid grid-cols-2 gap-2">
          <select className="p-2 border rounded" value={category_id} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">-- none --</option>
            {categories.map(c=> <option value={c.id} key={c.id}>{c.name}</option>)}
          </select>
          <input className="p-2 border rounded" value={tags} onChange={e=>setTags(e.target.value)} placeholder="tag1, tag2" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
