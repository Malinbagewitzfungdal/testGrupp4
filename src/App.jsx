import { useState } from 'react';
import './App.css';
import MovieList from './components/MovieList';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <MovieList />
    </>
  );
}

export default App;
