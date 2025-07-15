import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';

const feature = loadFeature('../features/edicao_salas.feature');

defineFeature(feature, test => {
  let response: any;
  let requestBody: any;
  let roomId: number;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();
    
    // Reset variables
    response = null;
    requestBody = {};
    roomId = 0;
  });

  test('Edição de sala com sucesso', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório antigo',
          capacity: 30,
          hasComputers: true,
          hasProjector: false
        }
      });
      roomId = room.id;
    });

    and('os campos estão preenchidos com as informações atuais da sala', () => {
      // Contexto dos campos preenchidos
    });

    when('ele edita o campo "Descrição" para "Laboratório renovado"', () => {
      requestBody.description = 'Laboratório renovado';
    });

    and('ele deixa os campos "Nome da sala", "Capacidade", "Tem computadores" e "Tem projetores" sem alteração', () => {
      // Campos não alterados - apenas description será enviado
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody);
    });

    then('o sistema edita as informações armazenadas', async () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verificar se foi atualizado no banco
      const roomInDb = await prisma.room.findUnique({
        where: { id: roomId }
      });
      expect(roomInDb!.description).toBe('Laboratório renovado');
      expect(roomInDb!.name).toBe('GRAD 04'); // Não deve ter mudado
    });

    and('a mensagem "Sala atualizada com sucesso" é exibida.', () => {
      expect(response.body.message).toBe('Sala atualizada com sucesso');
    });
  });

  test('Edição de sala mal sucedida por falta de dados', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório antigo',
          capacity: 30,
          hasComputers: true,
          hasProjector: false
        }
      });
      roomId = room.id;
    });

    and('os campos estão preenchidos com as informações atuais da sala', () => {
      // Contexto dos campos preenchidos
    });

    when('ele não altera nenhum campo do formulário', () => {
      // requestBody fica vazio
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody);
    });

    then('o sistema reconhece que nenhum dado foi fornecido para atualização', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Nenhum dado fornecido para atualização" é exibida.', () => {
      expect(response.body.message).toBe('Nenhum dado fornecido para atualização');
    });
  });

  test('Erro na edição de sala por nome indisponível', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      // Criar sala GRAD 04
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório 4',
          capacity: 30,
          hasComputers: true,
          hasProjector: false
        }
      });
      roomId = room.id;

      // Criar sala GRAD 05 (que já existe)
      await prisma.room.create({
        data: {
          name: 'GRAD 05',
          description: 'Laboratório 5',
          capacity: 25,
          hasComputers: false,
          hasProjector: true
        }
      });
    });

    when('ele edita o campo "Nome da sala" para "GRAD 05"', () => {
      requestBody.name = 'GRAD 05';
    });

    and('ele deixa os campos "Descrição", "Capacidade", "Tem computadores" e "Tem projetores" sem alteração', () => {
      // Apenas name será enviado
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody);
    });

    then('o sistema identifica que já existe uma sala com esse nome', () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Falha na edição. Esse nome está indisponível" é exibida.', () => {
      expect(response.body.message).toBe('Falha na edição. Esse nome está indisponível');
    });
  });

  test('Erro na edição de sala por capacidade negativa', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório 4',
          capacity: 30,
          hasComputers: true,
          hasProjector: false
        }
      });
      roomId = room.id;
    });

    when('ele edita o campo "Capacidade" para "-15"', () => {
      requestBody.capacity = -15;
    });

    and('ele deixa os campos "Nome da sala", "Descrição", "Tem computadores" e "Tem projetores" sem alteração', () => {
      // Apenas capacity será enviado
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody);
    });

    then('o sistema reconhece que a capacidade é um valor inválido', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Falha na edição. A capacidade deve ser um número positivo!" é exibida.', () => {
      expect(response.body.message).toBe('Falha na edição. A capacidade deve ser um número positivo!');
    });
  });

  test('Erro na edição de sala por ID inexistente', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('ele tenta editar uma sala com ID "999"', () => {
      roomId = 999;
    });

    when('ele edita o campo "Nome da sala" para "GRAD 10"', () => {
      requestBody.name = 'GRAD 10';
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody);
    });

    then('o sistema reconhece que a sala não existe', () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Sala não encontrada" é exibida.', () => {
      expect(response.body.message).toBe('Sala não encontrada');
    });
  });

  test('Erro na edição de sala por ID inválido', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('ele tenta editar uma sala com ID "abc"', () => {
      // ID inválido será usado na requisição
    });

    when('ele edita o campo "Nome da sala" para "GRAD 10"', () => {
      requestBody.name = 'GRAD 10';
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put('/api/rooms/abc')
        .send(requestBody);
    });

    then('o sistema reconhece que o ID é inválido', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "ID da sala deve ser um número válido" é exibida.', () => {
      expect(response.body.message).toBe('ID da sala deve ser um número válido');
    });
  });
});
