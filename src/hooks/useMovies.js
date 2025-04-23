import { useState, useEffect } from 'react';

const API_URL = 'https://tokenservice-jwt-2025.fly.dev';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/token-service/v1/request-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error('Inloggning misslyckades');

      const jwt = await res.text();
      localStorage.setItem('jwt', jwt);
      setToken(jwt);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const fetchMovies = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/movies`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Misslyckades hämta filmer');

      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMovies();
  }, [token]);

  return { login, fetchMovies, movies, loading, error };
};
