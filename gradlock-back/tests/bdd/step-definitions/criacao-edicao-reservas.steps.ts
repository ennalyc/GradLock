import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';

const feature = loadFeature('../features/reserva_salas.feature');

defineFeature(feature, (test) => {
  let response: any;
  let reservaCriada: any;
  let token: string;
  let userId: number;
  let roomId: number;
  const salaNome = 'E132';
  const userCpf = '11111111111';
  const userSenha = '123456';

  beforeAll(async () => {
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        cpf: userCpf,
        password: userSenha,
        userType: 'STUDENT',
      },
    });

    userId = user.id;

    const room = await prisma.room.create({
      data: {
        name: salaNome,
        description: 'Sala equipada',
        capacity: 35,
        hasComputers: true,
        hasProjector: false,
      },
    });

    roomId = room.id;

    const login = await request(app).post('/api/auth/login').send({
      cpf: userCpf,
      password: userSenha,
    });

    token = login.body.token;
  });

  beforeEach(async () => {
    await prisma.reservation.deleteMany();
  });

  test('Efetuar nova reserva em uma sala disponível', ({ given, and, when, then }) => {
    given('que estou na página “Efetuar nova reserva”', () => {});

    and('vejo a sala “E132” “disponível” para reserva', async () => {
      const sala = await prisma.room.findUnique({ where: { name: salaNome } });
      expect(sala).not.toBeNull();
    });

    when('eu clico na sala “E132”', () => {});

    then('posso ver que os dias “03/06/2025” e “05/06/2025” estão disponíveis nesta semana', async () => {});

    and('vejo que a sala “E132” comporta até “35 pessoas”', async () => {
      const sala = await prisma.room.findUnique({ where: { name: salaNome } });
      expect(sala!.capacity).toBe(35);
    });

    when('seleciono a data “03/06/2025”', () => {});

    and('clico em “confirmar”', async () => {
      response = await request(app)
        .post('/api/reservations/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          roomId,
          date: '2025-06-03',
          reason: 'Aula de revisão',
          startTime: '09:00',
          endTime: '11:00',
        });

      reservaCriada = response.body;
    });

    then('vejo uma mensagem de sucesso “Sala reservada com sucesso!” na tela', () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    and('estou na página “Efetuar nova reserva” e o dia “03/06/2025” está “indisponível” para reserva', async () => {
      const conflito = await prisma.reservation.findFirst({
        where: {
          roomId,
          date: new Date('2025-06-03'),
          startTime: '09:00',
        },
      });
      expect(conflito).not.toBeNull();
    });
  });

  test('Editar data de uma reserva futura', ({ given, and, when, then }) => {
    given('que estou na página “Minhas reservas”', () => {});

    and('vejo a sala “E132” na lista de reservas “solicitadas”', async () => {
      reservaCriada = await prisma.reservation.create({
        data: {
          userId,
          roomId,
          date: new Date('2025-06-03'),
          startTime: '10:00',
          endTime: '12:00',
          reason: 'Reunião',
          status: 'APPROVED',
        },
      });
    });

    and('a sala “E132” está “reservada” para o dia “03/06/2025”', () => {
      expect(reservaCriada.date.toISOString()).toContain('2025-06-03');
    });

    and('posso ver as opções de “Editar reserva” e “Cancelar reserva”', () => {});

    when('clico em “Editar reserva”', () => {});

    and('clico em “Mudar data”', () => {});

    then('posso ver a data “06/06/2025” como disponível para solicitar reserva', async () => {});

    when('seleciono a data “06/06/2015”', () => {});

    and('a mensagem de confirmação “Você deseja mudar a data de reserva?” aparece na tela', () => {});

    and('eu clico em “Sim”', async () => {
      response = await request(app)
        .put(`/api/reservations/booking/${reservaCriada.id}/attData`)
        .set('Authorization', `Bearer ${token}`)
        .send({ newDate: '2025-06-06' });
    });

    then('uma mensagem de sucesso “Data alterada com sucesso!” aparece na tela', () => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Data alterada com sucesso!');
    });

    and('estou na página “Minhas reservas” e a sala “E132” está “reservada” para o dia “06/06/2025”', async () => {
      const reserva = await prisma.reservation.findUnique({ where: { id: reservaCriada.id } });
      expect(reserva!.date.toISOString()).toContain('2025-06-06');
    });
  });

  test('Cancelar uma reserva com antecedência', ({ given, and, when, then }) => {
    given('que estou na página “Minhas reservas”', () => {});

    and('vejo a sala “E132” na lista de reservas “solicitadas”', async () => {
      reservaCriada = await prisma.reservation.create({
        data: {
          userId,
          roomId,
          date: new Date('2025-06-06'),
          startTime: '14:00',
          endTime: '16:00',
          reason: 'Revisão de prova',
          status: 'APPROVED',
        },
      });
    });

    and('a sala “E132” está “reservada” para o dia “06/06/2025”', () => {
      expect(reservaCriada.date.toISOString()).toContain('2025-06-06');
    });

    and('hoje é dia “01/06/2025”', () => {
      jest.useFakeTimers().setSystemTime(new Date('2025-06-01'));
    });

    and('posso ver as opções de “Editar reserva” e “Cancelar reserva”', () => {});

    when('clico em “Cancelar reserva”', () => {});

    then('a mensagem “Você tem certeza que deseja cancelar esta reserva?” aparece na tela', () => {});

    when('eu clico em “Sim”', async () => {
      response = await request(app)
        .delete(`/api/reservations/booking/${reservaCriada.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);
    });

    then('uma mensagem de sucesso “Reserva cancelada!” aparece na tela', () => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reserva cancelada!');
    });

    and('estou na página “Minhas reservas” e a sala “E132” está na lista de reservas “canceladas”', async () => {
      const reserva = await prisma.reservation.findUnique({ where: { id: reservaCriada.id } });
      expect(reserva!.status).toBe('CANCELED');
    });
  });
});
