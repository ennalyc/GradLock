import prisma from '../src/config/prismaClient';

// Setup global para os testes
beforeAll(async () => {
  // Conectar ao banco de dados de teste
  await prisma.$connect();
});

afterAll(async () => {
  // Limpar dados de teste e desconectar
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

// Limpeza entre testes
beforeEach(async () => {
  // Limpar dados entre testes
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
});

// Configuração global para timeouts
jest.setTimeout(30000);
