Feature: Cadastro de usuários

Scenario: Cadastro de aluno com sucesso
Given o aluno "João Pedro" 
And ele não possui cadastro prévio
And ele está na página de cadastro
When ele preenche o campo "Nome Completo" com "João Pedro da Silva"
And seleciona "Tipo de vínculo" como "Discente"
And a página exibe os campos "Curso" e "Matricula"
And ele preenche o campo "Curso" com "Ciencia da Computação"
And ele preenche o campo "Matricula" com "2021234567"
And ele preenche o campo "CPF" com "123.456.789-01"
And ele preenche o campo "Senha" com "020301"
And clica em "Cadastrar"
Then o sistema cadastra uma nova conta de usuário como "Discente" com as informações dadas
And uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida
And o usuário "João Silva" pode realizar login.

Scenario: Cadastro de professor com sucesso
Given o professor "Breno Miranda" 
And ele não possui cadastro prévio
And ele está na página de cadastro
When ele preenche o campo "Nome Completo" com "Breno Miranda da Silva"
And seleciona "Tipo de vínculo" como "Docente"
And a página não exibe os campos "Curso" e "Matrícula"
And ele preenche o campo "CPF" com "234.567.890-12"
And ele preenche o campo "Senha" com "310590"
And clica em "Cadastrar"
Then o sistema cadastra uma nova conta de usuário como "Docente" com as informações dadas
And uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida
And o usuário "Breno Miranda" com CPF "234.567.890-12" pode realizar login.

Scenario: Cadastro inválido com campo não preenchido
Given o aluno "João Felipe" 
And ele está na página de cadastro
When ele não preenche um dos campos do cadastro
And clica em "Cadastrar"
Then o sistema identifica a ausência de um dos campos
And uma mensagem de fracasso "Cadastro não realizado. Todos os campos devem ser preenchidos!" é exibida.

Scenario: Cadastro inválido com usuário já existente
Given o professor "Paulo Borba" 
And ele já possui cadastro prévio
And ele está na página de cadastro
When ele preenche todos os campos do cadastro
And clica em "Cadastrar"
Then o sistema identifica uma conta já existente com o "CPF" informado
And uma mensagem de fracasso "Cadastro não realizado. Esse usuário já foi cadastrado!" é exibida.
