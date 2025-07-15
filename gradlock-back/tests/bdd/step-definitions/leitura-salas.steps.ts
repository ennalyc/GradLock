import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';

const feature = loadFeature('../features/leitura_salas.feature');

defineFeature(feature, test => {
  let response: any;
  let roomId: number;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();
    
    // Reset variables
    response = null;
    roomId = 0;
  });

  test('Listar todas as salas com sucesso', ({ given, when, then, and }) => {
    given('existem salas cadastradas no sistema', async () => {
      // Criar algumas salas de teste
      await prisma.room.createMany({
        data: [
          {
            name: 'GRAD 1',
            description: 'Laboratório 1',
            capacity: 30,
            hasComputers: true,
            hasProjector: false
          },
          {
            name: 'GRAD 2',
            description: 'Laboratório 2',
            capacity: 25,
            hasComputers: false,
            hasProjector: true
          },
          {
            name: 'GRAD 3',
            description: 'Laboratório 3',
            capacity: 40,
            hasComputers: true,
            hasProjector: true
          }
        ]
      });
    });

    when('o usuário solicita a lista de todas as salas', async () => {
      response = await request(app)
        .get('/api/rooms');
    });

    then('o sistema retorna todas as salas ordenadas por nome', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      
      // Verificar ordenação por nome
      expect(response.body.data[0].name).toBe('GRAD 1');
      expect(response.body.data[1].name).toBe('GRAD 2');
      expect(response.body.data[2].name).toBe('GRAD 3');
    });

    and('a mensagem "Salas recuperadas com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Salas recuperadas com sucesso');
    });

    and('o número total de salas é informado', () => {
      expect(response.body.count).toBe(3);
    });
  });

  test('Listar salas quando não há salas cadastradas', ({ given, when, then, and }) => {
    given('não existem salas cadastradas no sistema', () => {
      // Não criar nenhuma sala
    });

    when('o usuário solicita a lista de todas as salas', async () => {
      response = await request(app)
        .get('/api/rooms');
    });

    then('o sistema retorna uma lista vazia', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    and('a mensagem "Salas recuperadas com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Salas recuperadas com sucesso');
    });

    and('o número total de salas é "0"', () => {
      expect(response.body.count).toBe(0);
    });
  });

  test('Buscar sala por ID com sucesso', ({ given, when, then, and }) => {
    given('existe uma sala com ID "1" cadastrada no sistema', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 1',
          description: 'Laboratório 1',
          capacity: 30,
          hasComputers: true,
          hasProjector: false
        }
      });
      roomId = room.id;
    });

    when('o usuário solicita a sala com ID "1"', async () => {
      response = await request(app)
        .get(`/api/rooms/${roomId}`);
    });

    then('o sistema retorna os dados da sala', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.name).toBe('GRAD 1');
      expect(response.body.data.description).toBe('Laboratório 1');
      expect(response.body.data.capacity).toBe(30);
    });

    and('a mensagem "Sala encontrada com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Sala encontrada com sucesso');
    });

    and('os dados incluem as reservas da sala', () => {
      expect(response.body.data.reservations).toBeDefined();
      expect(Array.isArray(response.body.data.reservations)).toBe(true);
    });
  });

  test('Buscar sala por ID inexistente', ({ given, when, then, and }) => {
    given('não existe uma sala com ID "999" no sistema', () => {
      // Não criar nenhuma sala
    });

    when('o usuário solicita a sala com ID "999"', async () => {
      response = await request(app)
        .get('/api/rooms/999');
    });

    then('o sistema retorna um erro', () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Sala não encontrada" é exibida', () => {
      expect(response.body.message).toBe('Sala não encontrada');
    });
  });

  test('Buscar sala com ID inválido', ({ given, when, then, and }) => {
    given('o usuário fornece um ID inválido "abc"', () => {
      // Contexto do ID inválido
    });

    when('o usuário solicita a sala com ID "abc"', async () => {
      response = await request(app)
        .get('/api/rooms/abc');
    });

    then('o sistema retorna um erro', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "ID da sala deve ser um número válido" é exibida', () => {
      expect(response.body.message).toBe('ID da sala deve ser um número válido');
    });
  });
});
