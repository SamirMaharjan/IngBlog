import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Users(){
  const [users, setUsers] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await api.get('/users'); setUsers(res.data.data || res.data || []); }catch(e){} }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="grid gap-2">
        {users.map(u=> <div key={u.id} className="p-3 bg-white rounded shadow">{u.name} • {u.email} • {u.role}</div>)}
      </div>
    </div>
  );
}
