import { defineFeature, loadFeature } from 'jest-cucumber';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/autenticação_usuarios.feature');

defineFeature(feature, (test) => {
  let response: any;
  let requestBody: any;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.user.deleteMany();

    // Reset variables
    response = null;
    requestBody = {};
  });

  test('Login de usuário bem sucedido', ({ given, and, when, then }) => {
    given('a usuária "Maria Fernanda"', async () => {
      const password = '041102';
      const hashedPassword = await bcrypt.hash(password, securityConfig.saltRounds);
      await prisma.user.create({
        data: {
          name: 'Maria Fernanda',
          cpf: '34567890123', // Sem formatação para armazenamento
          password: hashedPassword,
          userType: UserType.STUDENT,
        },
      });
    });
    and('ela tem cadastro prévio no sistema', () => {
      // Já tratado no given anterior
    });

    and('ela está na tela de login', () => {
      // Contexto da tela de login
    });

    when('ela preenche o campo "CPF" com "345.678.901-23"', () => {
      requestBody.cpf = '34567890123';
    });

    and('preenche o campo "Senha" com "041102"', () => {
      requestBody.password = '041102';
    });

    and('clica em "Entrar"', async () => {
      response = await request(app).post('/api/auth/login').send(requestBody);
    });

    then('o sistema encontra uma usuária com o "CPF" informado', () => {
      expect(response.status).toBe(200);
    });

    and('o sistema valida com a "Senha" dessa usuária', () => {
      expect(response.body.success).toBe(true);
    });

    and('a usuária recebe a mensagem "Login bem sucedido!"', () => {
      // Mensagem de Login bem sucedido!
    });

    and('a usuária é redirecionada para a tela principal da aplicação.', () => {
      // Redirecionamento para tela inicial
    });
  });

  test('Login de usuário mal sucedido por cpf inválido', ({ given, when, then, and }) => {
    given('a usuária "Joana Bezerra" está na tela de login', () => {
      // Contexto da tela de login
    });

    when('ela preenche o campo "CPF" com "456.789.012-34"', () => {
      requestBody.cpf = '45678901234';
    });

    and('preenche o campo "Senha" com "051203"', () => {
      requestBody.password = '051203';
    });

    and('clica em "Entrar"', async () => {
      response = await request(app).post('/api/auth/login').send(requestBody);
    });

    then('o sistema não encontra usuária com o "CPF" preenchido', () => {
      expect(response.status).toBe(404);
    });

    and(
      'a usuária recebe a mensagem "CPF não encontrado. Tente novamente ou realize o cadastro."',
      () => {
        // Mensagem de cpf não encontrado
      },
    );
  });

  test('Login de usuário mal sucedido por senha inválida', ({ given, and, when, then }) => {
    given('a usuária "Eduarda Maria"', async () => {
      // Criar usuária no banco de dados
      await prisma.user.create({
        data: {
          name: 'Eduarda Maria',
          cpf: '56789012345',
          password: 'correctPassword', // Senha correta diferente da que será testada
          userType: UserType.STUDENT,
        },
      });
    });

    and('ela tem cadastro prévio no sistema', () => {
      // Já tratado no given anterior
    });

    and('ela está na tela de login', () => {
      // Contexto da tela de login
    });

    when('ela preenche o campo "CPF" com "567.890.123-45"', () => {
      requestBody.cpf = '56789012345';
    });

    and('preenche o campo "Senha" com "060104"', () => {
      requestBody.password = '060104';
    });

    and('clica em "Entrar"', async () => {
      response = await request(app).post('/api/auth/login').send(requestBody);
    });

    then('o sistema encontra uma usuária com o "CPF" informado', () => {
      expect(response.status).toBe(401);
    });

    and('o sistema identifica que a "Senha" está incorreta', () => {
      expect(response.body.success).toBe(false);
    });

    and('a usuária recebe a mensagem "Senha incorreta. Tente novamente."', () => {
      // Mensagem de senha incorreta
    });
  });

  test('Login de usuário mal sucedido por campo em branco', ({ given, when, then, and }) => {
    given('a usuária "Paula Silva" está na tela de login', () => {
      // Contexto da tela de login
    });

    when('ela deixa de preencher pelo menos um dos campos', () => {
      requestBody = {
        cpf: '', // Campo vazio
        password: 'somePassword',
      };
    });

    and('clica em "Entrar"', async () => {
      response = await request(app).post('/api/auth/login').send(requestBody);
    });

    then('o sistema reconhece a ausência de um dos campos', () => {
      expect(response.status).toBe(400);
    });

    and('exibe "Preencha todos os campos antes de efetuar o login" para a usuária.', () => {
      // Mensagem indicando que todos os campos devem ser preenchidos
    });
  });
});
