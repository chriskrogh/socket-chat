const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || 3000);
console.log(`Server running...`);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    // connect
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets conected`);

    // disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        io.sockets.emit('get users', users);
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets conected`);
    });

    // send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {message: data, user: socket.username});
    });

    // new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        io.sockets.emit('get users', users);
    });
});
