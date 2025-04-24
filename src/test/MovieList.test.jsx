import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';
import { server } from './mocks/server';


import MovieList from '../components/MovieList';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

test('loggar in och hämtar filmer', async () => {
  render(<MovieList />);

  fireEvent.change(screen.getByPlaceholderText('Användarnamn'), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByPlaceholderText('Lösenord'), {
    target: { value: 'password123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /logga in/i }));

  await waitFor(() => {
    expect(screen.getByText('Filmer')).toBeInTheDocument();
    expect(screen.getByText(/The Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
  });
});
