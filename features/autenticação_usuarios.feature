Feature: Autenticação de usuários

Scenario: Login de usuário bem sucedido
Given a usuária "Maria Fernanda" 
And ela tem cadastro prévio no sistema
And ela está na tela de login
When ela preenche o campo "CPF" com "345.678.901-23"
And preenche o campo "Senha" com "041102"
And clica em "Entrar"
Then o sistema encontra uma usuária com o "CPF" informado
And o sistema valida com a "Senha" dessa usuária
And a usuária recebe a mensagem "Login bem sucedido!"
And a usuária é redirecionada para a tela principal da aplicação.

Scenario: Login de usuário mal sucedido por cpf inválido
Given a usuária "Joana Bezerra" está na tela de login
When ela preenche o campo "CPF" com "456.789.012-34"
And preenche o campo "Senha" com "051203"
And clica em "Entrar"
Then o sistema não encontra usuária com o "CPF" preenchido
And a usuária recebe a mensagem "CPF não encontrado. Tente novamente ou realize o cadastro."

Scenario: Login de usuário mal sucedido por senha inválida
Given a usuária "Eduarda Maria" 
And ela tem cadastro prévio no sistema
And ela está na tela de login
When ela preenche o campo "CPF" com "567.890.123-45"
And preenche o campo "Senha" com "060104"
And clica em "Entrar"
Then o sistema encontra uma usuária com o "CPF" informado
And o sistema identifica que a "Senha" está incorreta
And a usuária recebe a mensagem "Senha incorreta. Tente novamente."

Scenario: Login de usuário mal sucedido por campo em branco
Given a usuária "Paula Silva" está na tela de login
When ela deixa de preencher pelo menos um dos campos
And clica em "Entrar"
Then o sistema reconhece a ausência de um dos campos
And exibe "Preencha todos os campos antes de efetuar o login" para a usuária.
