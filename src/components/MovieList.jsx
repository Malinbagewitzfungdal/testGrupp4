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
    <div className="p-4 max-w-md mx-auto">
      {!loggedIn ? (
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-2 py-1"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-2 py-1"
          />
          <button type="submit" className="bg-orange-400 text-white px-4 py-1 rounded">
            Logga in
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">Filmer</h2>
          {loading ? (
            <p>Laddar filmer...</p>
          ) : (
            <ul className="list-disc list-inside">
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
