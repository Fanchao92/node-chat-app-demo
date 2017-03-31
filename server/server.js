const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname, '..', 'public');
const portNum = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log(`A new user is connected. Socket #: ${socket.id}`);

	socket.emit('newMessage', generateMessage('administrator', 'Welcome to the chat room!'));
	socket.broadcast.emit('newMessage', generateMessage('administrator', 'Someone joins the chat room!'));

	socket.on('createMessage', (message) => {
		if(message.from && message.text) {
			console.log(`newMessage from ${message.from}: ${message.text}`);
			io.emit('newMessage', generateMessage(message.from, message.text));
		}
	});

	socket.on('disconnect', () => {
		console.log(`A user is disconnected from server. Socket #: ${socket.id}`);
	});
});

server.listen(portNum, () => {
	console.log(`Server is up on port ${portNum}`);
	console.log(`Server Diretory Name: ${publicPath}`);
});