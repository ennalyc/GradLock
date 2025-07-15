# Testes BDD Implementados - Sistema GradLock

Este documento descreve os testes BDD (Behavior-Driven Development) implementados para o sistema GradLock usando Jest e jest-cucumber.

## Estrutura dos Testes

### Localização dos Arquivos
- **Features**: `gradlock/features/`
- **Step Definitions**: `tests/bdd/step-definitions/`
- **Configuração**: `jest.config.js`
- **Setup**: `tests/setup.ts`

### Tecnologias Utilizadas
- **Jest**: Framework de testes principal
- **jest-cucumber**: Biblioteca para integração BDD com Jest
- **SuperTest**: Para testes de API REST
- **TypeScript**: Linguagem de programação
- **Prisma**: ORM para acesso ao banco de dados

## Cenários de Teste Implementados

### 1. Cadastro de Salas (`cadastro-salas.feature`)

#### Cenários:
1. **Cadastro de sala bem sucedido**
   - Administrador preenche todos os campos corretamente
   - Sistema cadastra a sala no banco de dados
   - Mensagem de sucesso é exibida
   - Sala aparece na lista de salas

2. **Cadastro mal sucedido por falta de informações**
   - Administrador deixa campos obrigatórios vazios
   - Sistema rejeita o cadastro
   - Mensagem de erro é exibida

3. **Cadastro mal sucedido por capacidade negativa**
   - Administrador informa capacidade negativa
   - Sistema rejeita o cadastro
   - Mensagem de erro sobre capacidade é exibida

4. **Cadastro mal sucedido por sala já existente**
   - Administrador tenta cadastrar sala com nome já existente
   - Sistema rejeita o cadastro
   - Mensagem de erro sobre duplicação é exibida

### 2. Leitura de Salas (`leitura-salas.feature`)

#### Cenários:
1. **Listar todas as salas com sucesso**
   - Sistema retorna todas as salas ordenadas por nome
   - Mensagem de sucesso é exibida
   - Número total de salas é informado

2. **Listar salas quando não há salas cadastradas**
   - Sistema retorna lista vazia
   - Mensagem de sucesso é exibida
   - Contador mostra zero salas

3. **Buscar sala por ID com sucesso**
   - Sistema retorna dados da sala específica
   - Inclui informações sobre reservas
   - Mensagem de sucesso é exibida

4. **Buscar sala por ID inexistente**
   - Sistema retorna erro 404
   - Mensagem de erro "Sala não encontrada"

5. **Buscar sala com ID inválido**
   - Sistema retorna erro 400
   - Mensagem de erro sobre ID inválido

### 3. Edição de Salas (`edicao-salas.feature`)

#### Cenários:
1. **Edição de sala com sucesso**
   - Administrador altera campos da sala
   - Sistema atualiza os dados no banco
   - Mensagem de sucesso é exibida

2. **Edição mal sucedida por falta de dados**
   - Administrador não informa nenhum dado para atualização
   - Sistema rejeita a edição
   - Mensagem de erro é exibida

3. **Erro por nome indisponível**
   - Administrador tenta usar nome já existente
   - Sistema rejeita a edição
   - Mensagem de erro sobre nome indisponível

4. **Erro por capacidade negativa**
   - Administrador informa capacidade negativa
   - Sistema rejeita a edição
   - Mensagem de erro sobre capacidade

5. **Erro por ID inexistente**
   - Tentativa de editar sala que não existe
   - Sistema retorna erro 404

6. **Erro por ID inválido**
   - Tentativa de editar com ID não numérico
   - Sistema retorna erro 400

### 4. Deleção de Salas (`delecao-salas.feature`)

#### Cenários:
1. **Deleção de sala com sucesso**
   - Sala sem reservas ativas é deletada
   - Sistema confirma a deleção
   - Dados da sala deletada são retornados

2. **Erro por ID inválido**
   - Tentativa de deletar com ID não numérico
   - Sistema retorna erro 400

3. **Erro por sala inexistente**
   - Tentativa de deletar sala que não existe
   - Sistema retorna erro 404

4. **Erro por reservas ativas**
   - Tentativa de deletar sala com reservas futuras
   - Sistema impede a deleção
   - Informa número de reservas ativas

## Configuração dos Testes

### Scripts NPM
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:bdd": "jest --testPathPatterns=bdd"
}
```

### Configuração do Jest
- **maxWorkers**: 1 (execução sequencial para evitar conflitos de banco)
- **testTimeout**: 30000ms
- **forceExit**: true (forçar saída após testes)
- **testEnvironment**: node

### Setup dos Testes
- Limpeza do banco de dados antes de cada teste
- Configuração de timeout global
- Conexão/desconexão do Prisma

## Execução dos Testes

### Comandos Disponíveis:
```bash
# Executar todos os testes
npm test

# Executar apenas testes BDD
npm run test:bdd

# Executar teste específico
npm test -- tests/bdd/step-definitions/cadastro-salas.steps.ts

# Executar com cobertura
npm run test:coverage
```

### Estrutura dos Dados
Os testes utilizam os seguintes campos do banco de dados:
- **Room**: id, name, description, capacity, hasComputers, hasProjector
- **User**: id, cpf, name, password, userType
- **Reservation**: id, date, startTime, endTime, reason, userId, roomId

## Resultados dos Testes

Todos os cenários foram implementados e estão funcionando corretamente:
- **Cadastro**: 4 cenários ✅
- **Leitura**: 5 cenários ✅
- **Edição**: 6 cenários ✅
- **Deleção**: 4 cenários ✅

**Total**: 19 cenários de teste BDD implementados e passando.
