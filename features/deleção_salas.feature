Feature: Deleção de salas

Scenario: Deleção de sala com sucesso
Given o administrador "Pedro Dias"
And existe uma sala com ID "1" no sistema
And a sala não possui reservas ativas ou futuras
When ele solicita a deleção da sala com ID "1"
Then o sistema deleta a sala com sucesso
And a mensagem "Sala deletada com sucesso" é exibida
And os dados da sala deletada são retornados

Scenario: Erro na deleção por ID inválido
Given o administrador "Pedro Dias"
When ele solicita a deleção da sala com ID "abc"
Then o sistema reconhece que o ID é inválido
And a mensagem "ID da sala deve ser um número válido" é exibida

Scenario: Erro na deleção por sala inexistente
Given o administrador "Pedro Dias"
When ele solicita a deleção da sala com ID "999"
Then o sistema reconhece que a sala não existe
And a mensagem "Sala não encontrada" é exibida

Scenario: Erro na deleção por reservas ativas
Given o administrador "Pedro Dias"
And existe uma sala com ID "1" no sistema
And a sala possui reservas ativas ou futuras
When ele solicita a deleção da sala com ID "1"
Then o sistema não permite a deleção
And a mensagem "Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala" é exibida
And o número de reservas ativas é informado

Scenario: Erro interno do servidor na deleção
Given o administrador "Pedro Dias"
And existe uma sala com ID "1" no sistema
And ocorre um erro interno no servidor
When ele solicita a deleção da sala com ID "1"
Then o sistema retorna um erro interno
And a mensagem "Erro interno do servidor ao deletar sala" é exibida