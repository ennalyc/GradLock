import { PrismaClient, UserType } from '../../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Criar administrador padrão
  const admin = await prisma.user.upsert({
    where: { cpf: '12345678900' },
    update: {},
    create: {
      cpf: '12345678900',
      name: 'Administrador do Sistema',
      password: 'admin123', // Em produção, isso deve ser hasheado
      userType: UserType.ADMIN,
    },
  });

  // Criar alguns professores
  const professor1 = await prisma.user.upsert({
    where: { cpf: '23456789012' },
    update: {},
    create: {
      cpf: '23456789012',
      name: 'Breno Miranda da Silva',
      password: '310590',
      userType: UserType.TEACHER,
    },
  });

  // Criar alguns alunos
  const aluno1 = await prisma.user.upsert({
    where: { cpf: '34567890123' },
    update: {},
    create: {
      cpf: '34567890123',
      name: 'Maria Fernanda dos Santos',
      password: '041102',
      userType: UserType.STUDENT,
      course: 'Ciência da Computação',
      enrollment: '2021234567',
    },
  });

  const aluno2 = await prisma.user.upsert({
    where: { cpf: '45678901234' },
    update: {},
    create: {
      cpf: '456.789.012-34',
      name: 'João Pedro da Silva',
      password: '020301',
      userType: UserType.STUDENT,
      course: 'Engenharia de Software',
      enrollment: '2022123456',
    },
  });

  // Criar algumas salas
  const sala1 = await prisma.room.upsert({
    where: { name: 'GRAD 6' },
    update: {},
    create: {
      name: 'GRAD 6',
      description: 'Laboratório de tamanho médio',
      capacity: 40,
      hasComputers: true,
      hasProjector: true,
    },
  });

  const sala2 = await prisma.room.upsert({
    where: { name: 'E112' },
    update: {},
    create: {
      name: 'E112',
      description: 'Sala de aula tradicional',
      capacity: 50,
      hasComputers: false,
      hasProjector: true,
    },
  });

  const sala3 = await prisma.room.upsert({
    where: { name: 'A101' },
    update: {},
    create: {
      name: 'A101',
      description: 'Auditório pequeno',
      capacity: 100,
      hasComputers: false,
      hasProjector: true,
    },
  });

  console.log('Dados de seed criados com sucesso!');
  console.log({ admin, professor1, aluno1, aluno2, sala1, sala2, sala3 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
