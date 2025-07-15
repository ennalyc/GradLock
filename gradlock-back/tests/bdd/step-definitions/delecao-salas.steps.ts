import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';

const feature = loadFeature('../features/delecao_salas.feature');

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

  test('Deleção de sala com sucesso', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('existe uma sala com ID "1" no sistema', async () => {
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

    and('a sala não possui reservas ativas ou futuras', () => {
      // Não criar reservas para esta sala
    });

    when('ele solicita a deleção da sala com ID "1"', async () => {
      response = await request(app)
        .delete(`/api/rooms/${roomId}`);
    });

    then('o sistema deleta a sala com sucesso', async () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verificar se foi deletado do banco
      const roomInDb = await prisma.room.findUnique({
        where: { id: roomId }
      });
      expect(roomInDb).toBeNull();
    });

    and('a mensagem "Sala deletada com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Sala deletada com sucesso');
    });

    and('os dados da sala deletada são retornados', () => {
      expect(response.body.data.deletedRoom).toBeDefined();
      expect(response.body.data.deletedRoom.name).toBe('GRAD 1');
      expect(response.body.data.deletedRoom.description).toBe('Laboratório 1');
    });
  });

  test('Erro na deleção por ID inválido', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    when('ele solicita a deleção da sala com ID "abc"', async () => {
      response = await request(app)
        .delete('/api/rooms/abc');
    });

    then('o sistema reconhece que o ID é inválido', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "ID da sala deve ser um número válido" é exibida', () => {
      expect(response.body.message).toBe('ID da sala deve ser um número válido');
    });
  });

  test('Erro na deleção por sala inexistente', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    when('ele solicita a deleção da sala com ID "999"', async () => {
      response = await request(app)
        .delete('/api/rooms/999');
    });

    then('o sistema reconhece que a sala não existe', () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Sala não encontrada" é exibida', () => {
      expect(response.body.message).toBe('Sala não encontrada');
    });
  });

  test('Erro na deleção por reservas ativas', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias"', () => {
      // Contexto do administrador
    });

    and('existe uma sala com ID "1" no sistema', async () => {
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

    and('a sala possui reservas ativas ou futuras', async () => {
      // Criar um usuário para a reserva
      const user = await prisma.user.create({
        data: {
          cpf: '12345678901',
          name: 'João Silva',
          password: 'senha123',
          userType: 'STUDENT'
        }
      });

      // Criar uma reserva futura
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 dias no futuro

      await prisma.reservation.create({
        data: {
          date: futureDate,
          startTime: '09:00',
          endTime: '11:00',
          reason: 'Aula de laboratório',
          userId: user.id,
          roomId: roomId
        }
      });
    });

    when('ele solicita a deleção da sala com ID "1"', async () => {
      response = await request(app)
        .delete(`/api/rooms/${roomId}`);
    });

    then('o sistema não permite a deleção', () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    and('a mensagem "Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala" é exibida', () => {
      expect(response.body.message).toBe('Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala');
    });

    and('o número de reservas ativas é informado', () => {
      expect(response.body.data.activeReservations).toBe(1);
    });
  });
});
