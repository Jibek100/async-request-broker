#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'queue';
        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log('Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            var req = msg.content;

            console.log("Got request from Microservice 1");
        
            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(req), {
                correlationId: msg.properties.correlationId
            });

            channel.ack(msg);
        });
    });
});