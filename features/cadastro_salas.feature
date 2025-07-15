Feature: Cadastro de novas salas

Scenario: Cadastro de sala bem sucedido
Given o administrador "Pedro Dias" 
And ele está na página de cadastro de salas
When ele preenche o campo "Nome da Sala" com "GRAD 6"
And ele preenche o campo "Descrição" com "Laboratório de tamanho médio"
And ele preenche o campo "Capacidade" com "40"
And ele seleciona o campo "Tem computadores?"
And ele seleciona o campo "Tem projetores?"
And clica em "Cadastrar"
Then o sistema cadastra uma nova sala no banco com as informações dadas
And uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida
And o usuário "Pedro Dias" poderá visualizar a sala cadastrada na lista.

Scenario: Cadastro de sala mal sucedido por falta de informações
Given o administrador "Pedro Dias" 
And ele está na página de cadastro de salas
When deixa de preencher algum campo do formulario
And clica em "Cadastrar"
Then o sistema reconhece a ausencia de informações
And uma mensagem de erro "Cadastro não realizado. Todos os campos devem ser preenchidos!" é exibida.

Scenario: Cadastro de sala mal sucedido por capacidade negativa
Given o administrador "Pedro Dias" 
And ele está na página de cadastro de salas
When ele preenche o campo "Nome da Sala" com "GRAD 7"
And ele preenche o campo "Descrição" com "Laboratório de tamanho médio"
And ele preenche o campo "Capacidade" com "-10"
And ele seleciona o campo "Tem computadores?"
And ele seleciona o campo "Tem projetores?"
And clica em "Cadastrar"
Then o sistema reconhece que a capacidade é um valor inválido
And uma mensagem de erro "Capacidade deve ser um número positivo" é exibida.

Scenario: Cadastro de sala mal sucedido por ela já estar cadastrada
Given o administrador "Pedro Dias" 
And ele está na página de cadastro de salas
When ele preenche o campo "Nome da Sala" com "E112"
And ele preenche os outros campos do formulário
And clica em "Cadastrar"
Then o sistema reconhece que já existe uma sala com esse nome
And uma mensagem de erro "Cadastro não realizado. Sala já existente!" é exibida
