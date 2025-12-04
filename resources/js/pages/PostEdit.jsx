import React from 'react';
import PostForm from '../components/PostForm';
import PostDetail from '../components/PostDetail';
import { useParams } from 'react-router-dom';

export default function PostEdit(){
  const { id } = useParams();
  return id ? <PostDetail /> : <PostForm />;
}
