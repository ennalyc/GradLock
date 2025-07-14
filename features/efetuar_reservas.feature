Feature: Efetuar reserva e manutenção de reservas efetuadas

Scenario:  Efetuar nova reserva em uma sala disponível

Given que estou na página “Efetuar nova reserva”
And vejo a sala “E132” “disponível” para reserva
When eu clico na sala “E132”
Then posso ver que os dias “03/06/2025” e “05/06/2025” estão disponíveis nesta semana  
And vejo que a sala “E132” comporta até “35 pessoas”
When seleciono a data  “03/06/2025”
And clico em “confirmar”
Then vejo uma mensagem de sucesso “Sala reservada com sucesso!” na tela  
And estou na página “Efetuar nova reserva” e o dia “03/06/2025” está “indisponível” para reserva


Scenario:  Editar data de uma reserva futura

Given que estou na página “Minhas reservas”
And vejo a sala “E132” na lista de reservas “solicitadas”
And  a sala “E132” está “reservada” para o dia “03/06/2025”
And  posso ver as opções de “Editar reserva” e “Cancelar reserva”
When clico em “Editar reserva”
And clico em “Mudar data”
Then posso ver a data “06/06/2025” como disponível para solicitar reserva
When seleciono a data “06/06/2015”
And a mensagem de confirmação “Você deseja mudar a data de reserva?” aparece na tela  
And eu clico em “Sim”
Then uma mensagem de sucesso “Data alterada com sucesso!” aparece na tela
And estou na página “Minhas reservas” e a sala “E132” está “reservada” para o dia “06/06/2025”

Scenario:  Cancelar uma reserva com antecedência

Given que estou na página “Minhas reservas”
And vejo a sala “E132” na lista de reservas “solicitadas”
And a sala “E132” está “reservada” para o dia “06/06/2025”
And hoje é dia “01/06/2025”
And posso ver as opções de “Editar reserva” e “Cancelar reserva”
When clico em “Cancelar reserva”
Then a mensagem “Você tem certeza que deseja cancelar esta reserva?” aparece na tela
When eu clico em “Sim”
Then uma mensagem de sucesso “Reserva cancelada!” aparece na tela
And estou na página “Minhas reservas” e a sala “E132”  está na lista de reservas “canceladas”
