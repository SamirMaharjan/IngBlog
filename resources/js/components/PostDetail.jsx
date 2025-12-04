import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useParams } from 'react-router-dom';
import CommentSection from './CommentSection';

export default function PostDetail(){
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await api.get(`/posts/${id}`); setPost(res.data || res); }catch(e){ } }
  if(!post) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <div className="text-sm text-gray-600">By {post.author?.name}</div>
      <div className="mt-4 whitespace-pre-wrap">{post.body}</div>
      <CommentSection post={post} refresh={load} />
    </div>
  );
}
