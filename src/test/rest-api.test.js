import { describe, test, beforeEach, afterEach, expect } from 'vitest';

const jwtToken = 'eyJraWQiOiI2ODJhNDUzMi1iZjA5LTRmMDYtODFkZi02Mjk2MWQ5YmJlZWMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiU2ViYXN0aWFuIiwiZXhwIjoxNzQ0Nzk1NDIyLCJpYXQiOjE3NDQ3OTE4MjIsInNjb3BlIjoiVVNFUiJ9.ErJ8YqiA4Lm9EcGLrQdDjpNIVPAwtBuaS46kLQh_395MWz_YZ6WMBjCCU2XW1COfNkMZdUtqZL8rDQ0BzwI6dSLgH_EuasrM7JFoRvWj5DD1kMTXVMkuA1f3S9D-raxi3L-zqbkqrgRes5BHX7eroPPEbGRevHqUJ68sZgyNfsNuy4XAxRuXPOQbp3bNhjEcAjvYY-giM-TXJQ-N3WNW4xuIlLfs3wTWfdkOoQlXOG4sni9cNn3tTJqKnoDAy4zge1A-Il_XEoh9DBOMwhV-FTTsoQZ6whQ7R-TR5luYsMiku4eTTEkL_-fsWgeQBZgIufVXhxXaXMsIFXczVgX2vw';
const baseUrl = 'https://tokenservice-jwt-2025.fly.dev';

describe('GET /movies', () => {
  test('ska hämta alla filmer och returnera status 200', async () => {
    const res = await fetch(`${baseUrl}/movies`, {
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
    const res = await fetch(`${baseUrl}/movies`, {
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
      await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
    }
  });

  test('ska radera en film och returnera status 204', async () => {
    const res = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
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
    const createRes = await fetch(`${baseUrl}/movies`, {
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

    const deleteRes = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    expect(deleteRes.status).toBe(204);
  });
});

describe('PUT /movies/:id + GET /movies/:id', () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch(`${baseUrl}/movies`, {
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
      await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
    }
  });

  test('ska uppdatera en film och hämta den med nya värden', async () => {
    const updateRes = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
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

    const getRes = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    expect(getRes.status).toBe(200);
    const movie = await getRes.json();
    expect(movie.director).toBe('Ny Regissör');
    expect(movie.productionYear).toBe(2023);
  });
});
