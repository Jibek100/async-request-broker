Stack:
    node v18.13.0
    npm 8.19.3
    RabbitMQ 3.12.2
    Erlang 26.0.2

Configuration: 
    npm init --y
    npm install amqplib
    npm install request

Start:
    rabbitmq-server.bat in /sbin
    ./microservice2
    ./microservice1

About:
    Микросервис 1 вызывает public api и передает данные в микросервис 2 асинхронно посредством rabbitmq через очередь. Используется remote procedure call паттерн.
