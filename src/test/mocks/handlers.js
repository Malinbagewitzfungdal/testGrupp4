
import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://tokenservice-jwt-2025.fly.dev';

export const handlers = [
 
  http.post(`${BASE_URL}/token-service/v1/request-token`, async () => {
    return new Response('mocked-jwt-token', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }),

  
  http.get(`${BASE_URL}/movies`, () => {
    return HttpResponse.json([
      { id: 1, title: 'The Matrix', productionYear: 1999 },
      { id: 2, title: 'Inception', productionYear: 2010 }
    ]);
  }),
];
