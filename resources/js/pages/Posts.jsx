import React from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';

export default function Posts(){
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link to="/posts/new" className="px-3 py-1 border rounded">New Post</Link>
      </div>
      <PostList />
    </div>
  );
}
