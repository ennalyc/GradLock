import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';

const feature = loadFeature('../features/efetuar_reservas.feature');

defineFeature(feature, (test) => {
  let response: any;
  let reservaCriada: any;
  let token: string;
  let userId: number;
  let roomId: number;
  const salaNome = 'E132';
  const userCpf = '11111111111';
  const userSenha = '123456';
  let selectedDate: string; // Adicionado para capturar a data do Gherkin

  beforeAll(async () => {
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        cpf: '11111111111',
        password: '123456',
        userType: 'STUDENT',
      },
    });
    userId = user.id;

    const room = await prisma.room.create({
      data: {
        name: 'E132',
        description: 'Sala equipada',
        capacity: 35,
        hasComputers: true,
        hasProjector: false,
      },
    });
    roomId = room.id;

    const login = await request(app).post('/api/auth/login').send({
      cpf: '11111111111',
      password: '123456',
    });
    token = login.body.token;
  });

  beforeEach(async () => {
    await prisma.reservation.deleteMany();
  });

  afterEach(() => {
    jest.useRealTimers(); // Restaura os timers reais após cada teste
  });

  test('Efetuar nova reserva em uma sala disponível', ({ given, and, when, then }) => {
    given(/^que estou na página "(.*)"$/, (pagina) => {});

    and(/^vejo a sala "(.*)" "(.*)" para reserva$/, async (sala, status) => {
      const salaEncontrada = await prisma.room.findUnique({ where: { name: sala } });
      expect(salaEncontrada).not.toBeNull();
    });

    when(/^eu clico na sala "(.*)"$/, (sala) => {});

    then(/^posso ver que os dias "(.*)" e "(.*)" estão disponíveis nesta semana$/, (dia1, dia2) => {});

    and(/^vejo que a sala "(.*)" comporta até "(\d+) pessoas"$/, async (sala, capacidade) => {
      const salaEncontrada = await prisma.room.findUnique({ where: { name: sala } });
      expect(salaEncontrada!.capacity).toBe(Number(capacidade));
    });

    when(/^seleciono a data "(\d{2})\/(\d{2})\/(\d{4})"$/, (dia, mes, ano) => {
      // Formata a data para YYYY-MM-DD
      selectedDate = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    });

    and(/^clico em "(.*)"$/, async (botao) => {
      if (botao === 'confirmar') {
        response = await request(app)
          .post('/api/reservations/booking')
          .set('Authorization', `Bearer ${token}`)
          .send({
            roomId,
            date: selectedDate, // Usa a data dinâmica
            reason: 'Aula de revisão',
            startTime: '09:00',
            endTime: '11:00',
          });

        reservaCriada = response.body;
      }
      // Removido o else if (botao === 'Sim') que pertencia a outro cenário
    });

    then(/^vejo uma mensagem de sucesso "(.*)" na tela$/, (mensagem) => {
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.body.message || response.body.success).toBeTruthy();
    });

    and(/^estou na página "(.*)" e o dia "(.*)" está "(.*)" para reserva$/, async (pagina, dia, status) => {
      const conflito = await prisma.reservation.findFirst({
        where: {
          roomId,
          date: new Date(selectedDate), // Usa a data dinâmica
          startTime: '09:00',
        },
      });
      expect(conflito).not.toBeNull();
    });
  });

  test('Editar data de uma reserva futura', ({ given, and, when, then }) => {
    given(/^que estou na página "(.*)"$/, (arg0) => {});

    and(/^vejo a sala "(.*)" na lista de reservas "(.*)"$/, (arg0, arg1) => {});

    and(/^a sala "(.*)" está "(.*)" para o dia "(.*)"$/, (arg0, arg1, arg2) => {});

    and(/^posso ver as opções de "(.*)" e "(.*)"$/, (arg0, arg1) => {});

    when(/^clico em "(.*)"$/, (arg0) => {});

    and(/^clico em "(.*)"$/, (arg0) => {});

    then(/^posso ver a data "(.*)" como disponível para solicitar reserva$/, (arg0) => {});

    when(/^seleciono a data "(.*)"$/, (arg0) => {});

    and(/^a mensagem de confirmação "(.*)" aparece na tela$/, (arg0) => {});

    and(/^eu clico em "(.*)"$/, (arg0) => {});

    then(/^uma mensagem de sucesso "(.*)" aparece na tela$/, (arg0) => {});

    and(/^estou na página "(.*)" e a sala "(.*)" está "(.*)" para o dia "(.*)"$/, (arg0, arg1, arg2, arg3) => {});
  });

  test('Cancelar uma reserva com antecedência', ({ given, and, when, then }) => {
    given(/^que estou na página "(.*)"$/, () => {});

    and(/^vejo a sala "(.*)" na lista de reservas "(.*)"$/, async () => {
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

    and(/^a sala "(.*)" está "(.*)" para o dia "(.*)"$/, () => {
      expect(reservaCriada.date.toISOString()).toContain('2025-06-06');
    });

    and(/^hoje é dia "(.*)"$/, () => {
      jest.useFakeTimers().setSystemTime(new Date('2025-06-01'));
    });

    and(/^posso ver as opções de "(.*)" e "(.*)"$/, () => {});

    when(/^clico em "(.*)"$/, () => {}); // Vazio, mas faz parte do fluxo de UI

    then(/^a mensagem "(.*)" aparece na tela$/, () => {}); // Vazio, mas faz parte do fluxo de UI

    when(/^eu clico em "(.*)"$/, async () => {
      response = await request(app)
        .delete(`/api/reservations/booking/${reservaCriada.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);
    });

    then(/^uma mensagem de sucesso "(.*)" aparece na tela$/, (mensagem) => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(mensagem);
    });

    and(/^estou na página "(.*)" e a sala "(.*)" está na lista de reservas "(.*)"$/, async (pagina, sala, status) => {
      const reserva = await prisma.reservation.findUnique({ where: { id: reservaCriada.id } });
      expect(reserva!.status).toBe('REJECTED');
    });
  });
});