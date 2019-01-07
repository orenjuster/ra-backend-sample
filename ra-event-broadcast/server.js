var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port);

console.log('todo list RESTful API server started on: ' + port);

var amqp = require('amqplib/callback_api');

io.on('connection', function (socket) {  
  console.log("socket connected...");
});

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'RaEvents';

    ch.assertQueue(q, {durable: false});

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      io.emit('MA', {msg: msg.content.toString()});
    }, {noAck: true});
  });
});