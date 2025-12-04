\
/* React SPA for Laravel resources/js
Place these files into your Laravel project's resources/js folder.
Entry file: resources/js/app.jsx (already provided here) imports this module.

Build with Vite (Laravel Breeze / Jetstream typically already configured).
Set VITE_API_BASE in your .env to point to your Laravel API, e.g. VITE_API_BASE=http://localhost:8000/api
*/
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Simple API helper
async function apiRequest(method, path, token, body = null, query = null) {
  let url = `${API_BASE}${path}`;
  if (query) url += `?${new URLSearchParams(query).toString()}`;
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, {
    method,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) throw { status: res.status, data };
  return data;
}

function useAuth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rb_user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('rb_token'));
  useEffect(()=>{ localStorage.setItem('rb_user', JSON.stringify(user)); }, [user]);
  useEffect(()=>{ if(token) localStorage.setItem('rb_token', token); else localStorage.removeItem('rb_token'); }, [token]);
  const login = (token, user)=>{ setToken(token); setUser(user); };
  const logout = ()=>{ setToken(null); setUser(null); localStorage.removeItem('rb_token'); localStorage.removeItem('rb_user'); };
  return {user, token, login, logout};
}

// simple singleton auth for hooks
const authStore = { instance: null };
function useAuthContext(){ if(!authStore.instance) authStore.instance = useAuth(); return authStore.instance; }

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Nav />
        <div className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/posts" element={<PostsList/>} />
            <Route path="/posts/:id" element={<PostView/>} />
            <Route path="/posts/new" element={<PostForm/>} />
            <Route path="/posts/:id/edit" element={<PostForm editMode/>} />
            <Route path="/categories" element={<Categories/>} />
            <Route path="/tags" element={<Tags/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function Nav(){
  const auth = useAuthContext();
  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">Blog API Client</Link>
        <nav className="flex items-center gap-3">
          <Link to="/posts" className="hover:underline">Posts</Link>
          <Link to="/categories" className="hover:underline">Categories</Link>
          <Link to="/tags" className="hover:underline">Tags</Link>
          {auth.user?.role === 'admin' && <Link to="/users" className="hover:underline">Users</Link>}
          {auth.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{auth.user.name} ({auth.user.role})</span>
              <button className="px-3 py-1 border rounded" onClick={()=>{ auth.logout(); window.location.href='/'; }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function Home(){
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="mt-2">Use this client to interact with the Laravel Blog API. Browse posts, create posts (when authenticated), comment, and manage entities if you are admin.</p>
      <div className="mt-6"><Link to="/posts" className="text-indigo-600 hover:underline">Go to posts →</Link></div>
    </div>
  );
}

function Login(){
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);
  async function submit(e){ e.preventDefault(); setError(null);
    try{
      const res = await apiRequest('POST','/auth/login', null, { email, password });
      auth.login(res.token, res.user);
      navigate('/posts');
    }catch(err){ setError(err.data?.message || (err.data?.errors ? JSON.stringify(err.data.errors) : 'Login failed')); }
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
          <Link to="/" className="text-sm">Back</Link>
        </div>
      </form>
    </div>
  );
}

function PostsList(){
  const auth = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  useEffect(()=>{ load(); }, [page, perPage]);
  async function load(){
    try{
      const data = await apiRequest('GET', '/posts', auth.token, null, { page, per_page: perPage });
      setPosts(data.data || data);
      if(data.meta) { setTotalPages(data.meta.last_page); }
      else setTotalPages(1);
    }catch(err){ console.error(err); }
  }
  async function search(e){ e.preventDefault();
    try{ const data = await apiRequest('GET','/posts/search', auth.token, null, { q, per_page: perPage }); setPosts(data.data || data); }catch(err){ console.error(err); }
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Posts</h2>
        <div className="flex gap-2">
          <Link to="/posts/new" className="px-3 py-1 border rounded">+ New Post</Link>
        </div>
      </div>

      <form onSubmit={search} className="mt-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title/author/category/tag" className="flex-1 p-2 border rounded" />
        <button className="px-3 py-1 border rounded">Search</button>
      </form>

      <div className="mt-4 space-y-3">
        {posts.length===0 && <div className="text-sm text-gray-600">No posts yet.</div>}
        {posts.map(p=> (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <Link to={`/posts/${p.id}`} className="font-semibold text-lg">{p.title}</Link>
              <span className="text-sm text-gray-500">{p.status}</span>
            </div>
            <div className="text-sm text-gray-600">By {p.author?.name || 'Unknown'} • {p.category?.name || 'Uncategorized'}</div>
            <div className="mt-2 text-sm">{(p.body||'').slice(0,200)}...</div>
            <div className="mt-2 flex gap-2">
              { (auth.user?.id === p.author?.id || auth.user?.role==='admin') && <Link to={`/posts/${p.id}/edit`} className="text-sm px-2 py-1 border rounded">Edit</Link> }
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="px-3 py-1 border rounded" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <div>Page {page} / {totalPages}</div>
        <button className="px-3 py-1 border rounded" onClick={()=>setPage(p=>p+1)}>Next</button>
        <select value={perPage} onChange={e=>setPerPage(Number(e.target.value))} className="ml-auto border p-1 rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>
    </div>
  );
}

function PostView(){
  const { id } = useParams();
  const auth = useAuthContext();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  useEffect(()=>{ load(); }, []);
  async function load(){
    try{ const data = await apiRequest('GET', `/posts/${id}`, auth.token); setPost(data); }catch(err){ console.error(err); }
  }
  async function submitComment(e){ e.preventDefault();
    try{
      await apiRequest('POST','/comments', auth.token, { commentable_type: 'post', commentable_id: id, body: comment });
      setComment(''); load();
    }catch(err){ alert('Failed to post comment'); }
  }
  if(!post) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <div className="text-sm text-gray-600">By {post.author?.name} • {post.category?.name}</div>
      <div className="mt-4 whitespace-pre-wrap">{post.body}</div>

      <section className="mt-6">
        <h3 className="font-semibold">Comments</h3>
        <div className="mt-2 space-y-2">
          {(post.comments || []).map(c=> (
            <div key={c.id} className="p-3 border rounded">
              <div className="text-sm text-gray-600">{c.author?.name}</div>
              <div className="mt-1">{c.body}</div>
            </div>
          ))}
        </div>

        {auth.user ? (
          <form onSubmit={submitComment} className="mt-4">
            <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full border p-2 rounded" placeholder="Write a comment..."></textarea>
            <div className="mt-2"><button className="px-3 py-1 bg-indigo-600 text-white rounded">Post Comment</button></div>
          </form>
        ) : (
          <div className="mt-4 text-sm text-gray-600">Please <Link to="/login" className="text-indigo-600">login</Link> to comment.</div>
        )}
      </section>
    </div>
  );
}

function PostForm({ editMode }){
  const { id } = useParams();
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category_id, setCategoryId] = useState(null);
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(()=>{ loadCategories(); if(editMode) loadPost(); }, []);
  async function loadCategories(){ try{ const data = await apiRequest('GET','/categories', auth.token); setCategories(data.data || data); }catch(e){} }
  async function loadPost(){ try{ const data = await apiRequest('GET',`/posts/${id}`, auth.token); setTitle(data.title); setBody(data.body); setCategoryId(data.category?.id); setTags((data.tags||[]).map(t=>t.name).join(',')); }catch(e){ } }
  async function submit(e){ e.preventDefault(); try{
    const payload = { title, body, category_id, tags: tags.split(',').map(s=>s.trim()).filter(Boolean) };
    if(editMode){ await apiRequest('PUT', `/posts/${id}`, auth.token, payload); } else { await apiRequest('POST', '/posts', auth.token, payload); }
    navigate('/posts');
  }catch(err){ alert('Failed to save post'); }
  }
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">{editMode ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Body</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full p-2 border rounded h-40"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Category</label>
            <select value={category_id||''} onChange={e=>setCategoryId(e.target.value||null)} className="w-full p-2 border rounded">
              <option value="">-- none --</option>
              {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Tags (comma separated)</label>
            <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          <button type="button" className="px-4 py-2 border rounded" onClick={()=>navigate('/posts')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Categories(){
  const auth = useAuthContext();
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const data = await apiRequest('GET','/categories', auth.token); setCats(data.data || data); }catch(e){} }
  async function create(){ try{ await apiRequest('POST','/categories', auth.token, { name }); setName(''); load(); }catch(err){ alert('Failed'); } }
  return (
    <div>
      <h2 className="text-xl font-semibold">Categories</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="New category" className="w-full p-2 border rounded" />
          <button onClick={create} className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
        </div>
        <div>
          <ul className="space-y-2">
            {cats.map(c=> <li key={c.id} className="p-2 bg-white rounded shadow">{c.name}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Tags(){
  const auth = useAuthContext();
  const [tags, setTags] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const data = await apiRequest('GET','/tags', auth.token); setTags(data.data || data); }catch(e){} }
  return (
    <div>
      <h2 className="text-xl font-semibold">Tags</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {tags.map(t=> <div key={t.id} className="p-3 bg-white rounded shadow">{t.name}</div>)}
      </div>
    </div>
  );
}

function Users(){
  const auth = useAuthContext();
  const [users, setUsers] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const data = await apiRequest('GET','/users', auth.token); setUsers(data.data || data); }catch(e){ console.error(e); } }
  return (
    <div>
      <h2 className="text-xl font-semibold">Users</h2>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {users.map(u=> (
          <div key={u.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email} • {u.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotFound(){ return <div>Page not found</div>; }
