import app from '../src/app';
import request from 'supertest';

describe('Smoke Test - API Health Check', () => {
  it('deve iniciar a aplicação com sucesso', async () => {
    const response = await request(app)
      .get('/api/rooms');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
  });

  it('deve retornar 404 para rotas inexistentes', async () => {
    const response = await request(app)
      .get('/api/nonexistent');
    
    expect(response.status).toBe(404);
  });
});
