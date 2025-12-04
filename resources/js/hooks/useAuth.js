import { useState, useEffect } from 'react';
import api, { setAuthToken } from '../utils/api';

const KEY_USER = 'rb_user';
const KEY_TOKEN = 'rb_token';

export default function useAuth(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(KEY_USER) || 'null'));
  const [token, setToken] = useState(localStorage.getItem(KEY_TOKEN)||'null');

  useEffect(()=>{ localStorage.setItem(KEY_USER, JSON.stringify(user)); }, [user]);
  useEffect(()=>{
    if(token){ localStorage.setItem(KEY_TOKEN, token); setAuthToken(token); }
    else { localStorage.removeItem(KEY_TOKEN); setAuthToken(null); }
  }, [token]);

  const login = (token, user) => { setToken(token); setUser(user); };
  const logout = () => { setToken(null); setUser(null); localStorage.removeItem(KEY_USER); };

  return { user, token, login, logout };
}
