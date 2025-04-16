import { describe, test, beforeEach, afterEach, beforeAll, expect } from 'vitest';

let jwtToken;
const url = 'https://tokenservice-jwt-2025.fly.dev';

beforeAll(async () => {
  const res = await fetch(`${url}/token-service/v1/request-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'carlos',
      password: 'carlos'
    })
  });
  jwtToken = await res.text();
});

describe('GET /movies', () => {
  test('ska hämta alla filmer och returnera status 200', async () => {
    const res = await fetch(`${url}/movies`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('DELETE /movies/:id', () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch(`${url}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Ny film',
        productionYear: 1950,
        description: 'BLABLALLALBALBALBLABLLBALBLABLALBLALLBALBA',
        director: 'Nån Regissör'
      })
    });

    expect(res.status).toBe(201);
    createdMovie = await res.json();
  });

  afterEach(async () => {
    if (createdMovie?.id) {
      await fetch(`${url}/movies/${createdMovie.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
    }
  });

  test('ska radera en film och returnera status 204', async () => {
    const res = await fetch(`${url}/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    expect(res.status).toBe(204);
    createdMovie = null;
  });
});

describe('POST /movies + DELETE /movies/:id', () => {
  let createdMovie;

  test('ska skapa och radera en film', async () => {
    const createRes = await fetch(`${url}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Ny film',
        productionYear: 1950,
        description: 'BLABLALLALBALBALBLABLLBALBLABLALBLALLBALBA',
        director: 'Nån Regissör'
      })
    });

    expect(createRes.status).toBe(201);
    createdMovie = await createRes.json();

    const deleteRes = await fetch(`${url}/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    expect(deleteRes.status).toBe(204);
  });
});

describe('PUT /movies/:id + GET /movies/:id', () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch(`${url}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Ny film',
        productionYear: 1950,
        description: 'BLABLALLALBALBALBLABLLBALBLABLALBLALLBALBA',
        director: 'Nån Regissör'
      })
    });

    expect(res.status).toBe(201);
    createdMovie = await res.json();
  });

  afterEach(async () => {
    if (createdMovie?.id) {
      await fetch(`${url}/movies/${createdMovie.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
    }
  });

  test('ska uppdatera en film och hämta den med nya värden', async () => {
    const updateRes = await fetch(`${url}/movies/${createdMovie.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Uppdaterad title',
        productionYear: 2023,
        description: 'BLABLALLALBALBALBLABLLBALBLABLALBLALLBALBA',
        director: 'Ny Regissör'
      })
    });

    expect(updateRes.status).toBe(200);
    const updated = await updateRes.json();
    expect(updated.title).toBe('Uppdaterad title');

    const getRes = await fetch(`${url}/movies/${createdMovie.id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    expect(getRes.status).toBe(200);
    const movie = await getRes.json();
    expect(movie.director).toBe('Ny Regissör');
    expect(movie.productionYear).toBe(2023);
  });
});
