Feature: Efetuar reserva e manutenção de reservas efetuadas

Scenario: Efetuar a reserva de uma sala em um horario disponivel
  Given que estou na página "Reservas"
  And a sala "E132" está disponível no dia "06/06/2024" no horario das "15h" as "17h"
  When eu reservo a sala "E132" para o dia "06/06/2024" no horario das "15h" as "17h"
  Then estou na página "Minhas Reservas"
  And a sala "E132" está na lista de "salas reservadas"
  And vejo a mensagem "Sala reservada com sucesso!"

Scenario: Efetuar a reserva de uma sala em horario ja reservado
  Given que estou na página "Reservas"
  And a sala "E132" não está disponível no dia "06/06/2024" no horario das "15h" as "17h"
  When eu tento reservar a sala "E132" no dia "06/06/2024" no horario das "15h" as "17h"
  Then eu vejo a mensagem "Essa sala já possui reserva neste horário!"
  And eu ainda estou na pagina "Reservas"

Scenario: Edicao da data da reserva de uma sala reservada 
  Given que estou na pagina "Minhas reservas"
  And que reservei a sala "E132" no dia "06/06/2024" no horario das "15h" as "17h"
  And a sala "E132" está disponível no dia "07/06/2024" no horario das "14h" as "16h"
  When eu edito a reserva da sala "E132" do dia "06/06/2024" para o dia "07/06/2024"
  And escolho o horario das "14h" as "16h"
  Then eu vejo a mensagem "A data da sua reserva foi alterada com sucesso!"
  And eu ainda estou na pagina "Reservas"
  And a sala "E132" esta reservada no dia "07/06/2024" no horario das "14h" as "16h"

Scenario: Edicao do horario da reserva de uma sala reservada
  Given que estou na pagina "Minhas reservas"
  And que reservei a sala "E132" no dia "06/06/2024" no horario das "15h" as "17h"
  And a sala "E132" está disponível no dia "06/06/2024" no horario das "7h" as "9h"
  When eu edito o horario da reserva da sala "E132" para das "7h" as "9h"
  Then eu vejo a mensagem "O horário da sua reserva foi alterado com sucesso!"
  And eu ainda estou na pagina "Reservas"
  And a sala "E132" esta reservada no dia "06/06/2024" no horario das "7h" as "9h"

Scenario: Cancelar reserva de uma sala
  Given que estou na pagina "Minhas reservas"
  And que reservei a sala "E132" no dia "06/06/2024" no horario das "15h" as "17h"
  When eu escolho cancelar minha reserva da sala "E132" no dia "06/06/2024" no horario das "15h" as "17h"
  Then eu vejo a mensagem "Reserva cancelada com sucesso!"
  And eu ainda estou na pagina "Reservas"
  And a sala "E132" esta disponivel no dia "06/06/2024" no horario das "15h" as "17h"

Scenario: Visualizar sala reservada em Minhas Reservas
  Given que reservei a sala "E132" no dia "06/06/2024" no horario das "15h" as "17h"
  When eu entro na pagina "Minhas reservas"
  Then a sala "E132" está na lista de "salas reservadas"