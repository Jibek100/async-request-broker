#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const request = require('request');

amqp.connect('amqp://localhost', function (error0, connection) { 
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            var correlationId = generateUuid();
            const response = makeRequest();

            console.log('Sent request to Microservice 2');

            channel.consume(q.queue, function (msg) {
                if (msg.properties.correlationId == correlationId) {
                    console.log('Got an answer from Microservice 2', JSON.stringify(msg.content.toString()));
                    setTimeout(function () {
                        connection.close();
                        process.exit(0)
                    }, 500);
                }
            }, {
                noAck: true
            });

            channel.sendToQueue('queue',
                Buffer.from(JSON.stringify(response)), {
                correlationId: correlationId,
                replyTo: q.queue
            });
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

function makeRequest() {

    const config = {
        method: 'get',
        url: 'https://zenquotes.io/api/random'
    }

    const response = request(config);
    return response;
}
