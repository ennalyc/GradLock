Feature: Leitura de salas

Scenario: Listar todas as salas com sucesso
Given existem salas cadastradas no sistema
When o usuário solicita a lista de todas as salas
Then o sistema retorna todas as salas ordenadas por nome
And a mensagem "Salas recuperadas com sucesso" é exibida
And o número total de salas é informado

Scenario: Listar salas quando não há salas cadastradas
Given não existem salas cadastradas no sistema
When o usuário solicita a lista de todas as salas
Then o sistema retorna uma lista vazia
And a mensagem "Salas recuperadas com sucesso" é exibida
And o número total de salas é "0"

Scenario: Buscar sala por ID com sucesso
Given existe uma sala com ID "1" cadastrada no sistema
When o usuário solicita a sala com ID "1"
Then o sistema retorna os dados da sala
And a mensagem "Sala encontrada com sucesso" é exibida
And os dados incluem as reservas da sala

Scenario: Buscar sala por ID inexistente
Given não existe uma sala com ID "999" no sistema
When o usuário solicita a sala com ID "999"
Then o sistema retorna um erro
And a mensagem "Sala não encontrada" é exibida

Scenario: Buscar sala com ID inválido
Given o usuário fornece um ID inválido "abc"
When o usuário solicita a sala com ID "abc"
Then o sistema retorna um erro
And a mensagem "ID da sala deve ser um número válido" é exibida
