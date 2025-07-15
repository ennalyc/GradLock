import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/cadastro_usuarios.feature');

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

  test('Cadastro de aluno com sucesso', ({ given, and, when, then }) => {
    given('o aluno "João Pedro"', () => {
      // Contexto do aluno
    });

    and('ele não possui cadastro prévio', async () => {
      // Verificar que não existe no banco (já garantido pelo beforeEach)
    });

    and('ele está na página de cadastro', () => {
      // Contexto da página de cadastro
    });

    when('ele preenche o campo "Nome Completo" com "João Pedro da Silva"', () => {
      requestBody.name = 'João Pedro da Silva';
    });

    and('seleciona "Tipo de vínculo" como "Discente"', () => {
      requestBody.userType = UserType.STUDENT;
    });

    and('a página exibe os campos "Curso" e "Matricula"', () => {
      // Contexto da UI (não precisa de ação)
    });

    and('ele preenche o campo "Curso" com "Ciencia da Computação"', () => {
      requestBody.course = 'Ciencia da Computação';
    });

    and('ele preenche o campo "Matricula" com "2021234567"', () => {
      requestBody.enrollment = '2021234567';
    });

    and('ele preenche o campo "CPF" com "123.456.789-01"', () => {
      requestBody.cpf = '12345678901';
    });

    and('ele preenche o campo "Senha" com "020301"', () => {
      requestBody.password = '020301';
    });

    and('clica em "Cadastrar"', async () => {
      response = await request(app).post('/api/users').send(requestBody);
    });

    then(
      'o sistema cadastra uma nova conta de usuário como "Discente" com as informações dadas',
      async () => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        // Verificar se foi salvo no banco
        const userInDb = await prisma.user.findUnique({
          where: { cpf: '12345678901' }, // CPF sem formatação
        });

        expect(userInDb).not.toBeNull();
        expect(userInDb!.name).toBe('João Pedro da Silva');
        expect(userInDb!.userType).toBe(UserType.STUDENT);
        expect(userInDb!.course).toBe('Ciencia da Computação');
        expect(userInDb!.enrollment).toBe('2021234567');
      },
    );

    and('uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida', () => {
      // Mensagem de cadastro realizado
    });

    and('o usuário "João Silva" pode realizar login.', async () => {
      const loginResponse = await request(app).post('/api/auth/login').send({
        cpf: '12345678901',
        password: '020301',
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
    });
  });

  test('Cadastro de professor com sucesso', ({ given, and, when, then }) => {
    given('o professor "Breno Miranda"', () => {
      // Contexto do professor
    });

    and('ele não possui cadastro prévio', () => {
      // Já garantido pelo beforeEach
    });

    and('ele está na página de cadastro', () => {
      // Contexto da página
    });

    when('ele preenche o campo "Nome Completo" com "Breno Miranda da Silva"', () => {
      requestBody.name = 'Breno Miranda da Silva';
    });

    and('seleciona "Tipo de vínculo" como "Docente"', () => {
      requestBody.userType = UserType.TEACHER;
    });

    and('a página não exibe os campos "Curso" e "Matrícula"', () => {
      // Contexto da UI (não precisa de ação)
    });

    and('ele preenche o campo "CPF" com "234.567.890-12"', () => {
      requestBody.cpf = '23456789012';
    });

    and('ele preenche o campo "Senha" com "310590"', () => {
      requestBody.password = '310590';
    });

    and('clica em "Cadastrar"', async () => {
      response = await request(app).post('/api/users').send(requestBody);
    });

    then(
      'o sistema cadastra uma nova conta de usuário como "Docente" com as informações dadas',
      async () => {
        expect(response.status).toBe(201);

        const userInDb = await prisma.user.findUnique({
          where: { cpf: '23456789012' },
        });

        expect(userInDb).not.toBeNull();
        expect(userInDb!.userType).toBe(UserType.TEACHER);
        expect(userInDb!.course).toBeNull(); // Docente não tem curso
        expect(userInDb!.enrollment).toBeNull(); // Docente não tem matrícula
      },
    );

    and('uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida', () => {
      // Mensagem de cadastro realizado
    });

    and('o usuário "Breno Miranda" com CPF "234.567.890-12" pode realizar login.', async () => {
      const loginResponse = await request(app).post('/api/auth/login').send({
        cpf: '23456789012',
        password: '310590',
      });
      expect(loginResponse.status).toBe(200);
    });
  });

  test('Cadastro inválido com campo não preenchido', ({ given, when, then, and }) => {
    given('o aluno "João Felipe"', () => {
      // Contexto do aluno
    });

    and('ele está na página de cadastro', () => {
      // Contexto da página
    });

    when('ele não preenche um dos campos do cadastro', () => {
      requestBody = {
        name: 'João Felipe',
        userType: UserType.STUDENT,
        // Campos obrigatórios faltando: CPF, senha, etc.
      };
    });

    and('clica em "Cadastrar"', async () => {
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema identifica a ausência de um dos campos', () => {
      expect(response.status).toBe(400);
    });

    and(
      'uma mensagem de fracasso "Cadastro não realizado. Todos os campos devem ser preenchidos!" é exibida.',
      () => {
        // Mensagem de falha no cadastro
      },
    );
  });

  test('Cadastro inválido com usuário já existente', ({ given, and, when, then }) => {
    given('o professor "Paulo Borba"', async () => {
      // Criar usuário existente
      await prisma.user.create({
        data: {
          name: 'Paulo Borba',
          cpf: '34567890123',
          password: 'existingPassword',
          userType: UserType.TEACHER,
        },
      });
    });

    and('ele já possui cadastro prévio', () => {
      // Já tratado no given anterior
    });

    and('ele está na página de cadastro', () => {
      // Contexto da página
    });

    when('ele preenche todos os campos do cadastro', () => {
      requestBody = {
        name: 'Paulo Borba',
        userType: UserType.TEACHER,
        cpf: '34567890123', // CPF já existente
        password: 'newPassword',
      };
    });

    and('clica em "Cadastrar"', async () => {
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema identifica uma conta já existente com o "CPF" informado', () => {
      expect(response.status).toBe(409);
    });

    and(
      'uma mensagem de fracasso "Cadastro não realizado. Esse usuário já foi cadastrado!" é exibida.',
      () => {
        // Mensagem de usuário já cadastrado
      },
    );
  });
});
