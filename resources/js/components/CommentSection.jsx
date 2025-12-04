import React, { useState } from 'react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

export default function CommentSection({ post, refresh }){
  const { user } = useAuth();
  const [body, setBody] = useState('');
  async function submit(e){
    e.preventDefault();
    try{
      await api.post('/comments', { commentable_type: 'post', commentable_id: post.id, body });
      setBody('');
      refresh();
    }catch(e){ alert('Failed to comment'); }
  }
  return (
    <section className="mt-6">
      <h3 className="font-semibold">Comments</h3>
      <div className="mt-2 space-y-2">
        {(post.comments||[]).map(c=> (
          <div key={c.id} className="p-3 border rounded">
            <div className="text-sm text-gray-600">{c.author?.name}</div>
            <div className="mt-1">{c.body}</div>
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={submit} className="mt-4">
          <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full border p-2 rounded" placeholder="Write a comment..."></textarea>
          <div className="mt-2"><button className="px-3 py-1 bg-indigo-600 text-white rounded">Post Comment</button></div>
        </form>
      ) : (
        <div className="mt-4 text-sm text-gray-600">Please log in to comment.</div>
      )}
    </section>
  );
}
