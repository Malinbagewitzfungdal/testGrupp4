import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';

export default function MovieList() {
  const { login, movies, loading, error } = useMovies();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    setLoggedIn(success);
  };

  return (
    <div>
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            Logga in
          </button>
          {error && <p>{error}</p>}
        </form>
      ) : (
        <div>
          <h2>Filmer</h2>
          {loading ? (
            <p>Laddar filmer...</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <li key={movie.id}>
                  {movie.title} ({movie.productionYear})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
