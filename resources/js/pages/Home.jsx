import React from 'react';
import PostList from '../components/PostList';

export default function Home(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Latest posts</h1>
      <PostList />
    </div>
  );
}
