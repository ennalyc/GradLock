# GradLock

Sistema de reserva de salas universitárias desenvolvido para a disciplina de Engenharia de Software e Sistemas.

## 📋 Sobre o Projeto

O GradLock é uma aplicação web que permite o gerenciamento e reserva de salas dentro de uma universidade, oferecendo funcionalidades para:

- ✅ **Cadastro de usuários** (Alunos, Professores)
- ✅ **Autenticação** por CPF e senha
- ✅ **Cadastro e gerenciamento de salas**
- ✅ **Sistema de reservas** com aprovação/negação
- ✅ **Verificação de disponibilidade**

## 🏗️ Arquitetura

```
GradLock/
├── features/                    # Arquivos de especificação BDD
├── gradlock-back/              # Backend API (Node.js + TypeScript)
└── README.md                   # Este arquivo
```

## 🖥️ Backend (API)

### 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **Prisma** - ORM e gerenciamento do banco
- **SQLite** - Banco de dados
- **Swagger** - Documentação da API
- **Zod** - Validação de dados
- **ESLint + Prettier** - Qualidade de código

### 📁 Estrutura do Backend

```
gradlock-back/
├── prisma/
│   ├── migrations/           # Histórico de migrações
│   ├── schema.prisma         # Schema do banco de dados
│   ├── seeds/                # Scripts para popular o db
│   └── dev.db                # Banco SQLite (desenvolvimento)
├── src/
│   ├── config/
│   │   ├── baseConfig.ts     # Configurações gerais
│   │   ├── prismaClient.ts   # Cliente do Prisma
│   │   └── swaggerConfig.ts  # Configuração do Swagger
│   ├── controllers/
│   │   └── roomsController.ts # Controlador de salas
│   ├── errors/
│   │   └── httpErrors.ts     # Classes de erro customizadas
│   ├── routes/
│   │   └── routes.ts         # Definição das rotas
│   ├── app.ts               # Configuração do Express
│   └── server.ts           # Ponto de entrada da aplicação
├── generated/               # Cliente Prisma gerado
├── dist/                   # Código TypeScript compilado
├── package.json           # Dependências e scripts
└── tsconfig.json         # Configuração TypeScript
```

### 🗄️ Modelo de Dados

#### **Usuários (User)**
- `id`: Identificador único
- `cpf`: CPF único (usado para login)
- `name`: Nome completo
- `password`: Senha (hasheada)
- `userType`: Tipo (STUDENT, TEACHER, ADMIN)
- `course`: Curso (apenas para alunos)
- `enrollment`: Matrícula (apenas para alunos)

#### **Salas (Room)**
- `id`: Identificador único
- `name`: Nome único da sala
- `description`: Descrição da sala
- `capacity`: Capacidade máxima
- `hasComputers`: Possui computadores
- `hasProjector`: Possui projetor

#### **Reservas (Reservation)**
- `id`: Identificador único
- `userId`: Usuário que fez a reserva
- `roomId`: Sala reservada
- `date`: Data da reserva
- `startTime`: Horário de início
- `endTime`: Horário de fim
- `status`: Status (PENDING, APPROVED, REJECTED)
- `reason`: Motivo da solicitação

### 🚀 Como Executar

#### **1. Pré-requisitos**
- Node.js v20.9.0 ou superior
- npm ou yarn

#### **2. Instalação**
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd GradLock/gradlock-back

# Instalar dependências
npm install

# Configurar banco de dados
npm run dev  # Primeira execução (gera cliente Prisma)
```

#### **3. Scripts Disponíveis**
```bash
# Desenvolvimento (com geração automática do Prisma)
npm run dev

# Desenvolvimento contínuo (sem regenerar Prisma)
npm run dev:watch

# Compilar para produção
npm run build

# Executar versão compilada
npm start

# Popular banco com dados de teste
npm run seed

# Linting e formatação
npm run lint
npm run format
```

#### **4. Variáveis de Ambiente**
Crie um arquivo `.env` na pasta `gradlock-back/`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
BASE_PATH="http://localhost:3000"
```

### 🗃️ Banco de Dados

#### **Inicializar**
```bash
# Aplicar migrações
npx prisma migrate dev

# Gerar cliente
npx prisma generate

# Popular com dados de teste
npm run seed
```

#### **Gerenciar**
```bash
# Visualizar dados (Prisma Studio)
npx prisma studio

# Reset completo do banco
npx prisma migrate reset

# Nova migração
npx prisma migrate dev --name nome_da_migracao
```

### ⚠️ Importantes

1. **Prisma Generate**: Sempre que modificar `schema.prisma`, execute `npx prisma generate`
2. **Migrações**: Use `npx prisma migrate dev` após mudanças no schema
3. **Ambiente**: O arquivo `.env` não deve ser commitado (já está no .gitignore)
4. **Desenvolvimento**: Use `npm run dev` na primeira execução, depois `npm run dev:watch`

## 👥 Equipe

**Arthur Pompilio**
**Ennaly Carol**
**Julio César**
**Leonardo Moreira**
**Rodrigo Rossiter**

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos.
Projeto desenvolvido para a disciplina de **Engenharia de Software e Sistemas**.