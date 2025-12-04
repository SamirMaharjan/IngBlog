import React from 'react';
import '../css/app.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostEdit from './pages/PostEdit';
import PostNew from './pages/PostEdit';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Users from './pages/Users';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './contexts/AuthContext';

export default function App(){
  return (
    <Layout>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/posts" element={<ProtectedRoute><Posts/></ProtectedRoute>} />
        <Route path="/posts/new" element={<PostNew/>} />
        <Route path="/posts/:id" element={<PostEdit/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/tags" element={<Tags/>} />
        <Route path="/users" element={<Users/>} />
      </Routes>
      </AuthProvider>
      <ToastContainer position="top-right" />
      
    </Layout>
  );
}
