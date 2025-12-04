import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Tags(){
  const [tags, setTags] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await api.get('/tags'); setTags(res.data.data || res.data || []); }catch(e){} }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      <div className="grid grid-cols-3 gap-3">
        {tags.map(t=> <div key={t.id} className="p-3 bg-white rounded shadow">{t.name}</div>)}
      </div>
    </div>
  );
}
