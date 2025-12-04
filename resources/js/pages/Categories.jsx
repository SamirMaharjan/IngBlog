import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Categories(){
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await api.get('/categories'); setCats(res.data.data || res.data || []); }catch(e){} }
  async function create(){ try{ await api.post('/categories', { name }); setName(''); load(); }catch(e){ alert('Failed'); } }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded" placeholder="New category" />
          <button onClick={create} className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
        </div>
        <div>
          {cats.map(c=> <div key={c.id} className="p-2 bg-white rounded shadow mb-2">{c.name}</div>)}
        </div>
      </div>
    </div>
  );
}
