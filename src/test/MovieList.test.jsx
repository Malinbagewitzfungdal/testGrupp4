// /test/MovieList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';
import { server } from './mocks/server';
import 'whatwg-fetch';

import MovieList from '../components/MovieList';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear(); // så testet alltid börjar från scratch
});
afterAll(() => server.close());

test('loggar in och hämtar filmer', async () => {
  render(<MovieList />);

  // Fyll i inloggningsuppgifter
  fireEvent.change(screen.getByPlaceholderText('Användarnamn'), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByPlaceholderText('Lösenord'), {
    target: { value: 'password123' },
  });

  // Klicka på knappen
  fireEvent.click(screen.getByRole('button', { name: /logga in/i }));

  // Vänta tills filmerna hämtas och visas
  await waitFor(() => {
    expect(screen.getByText('Filmer')).toBeInTheDocument();
    expect(screen.getByText(/The Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
  });
});
