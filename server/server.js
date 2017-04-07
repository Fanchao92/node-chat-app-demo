const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname, '..', 'public');
const portNum = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log(`New User connected at ${new Date().getTime()}. Socket #: ${socket.id}`);

	socket.emit('newMessage', generateMessage('administrator', 'Welcome to the chat room!'));
	socket.broadcast.emit('newMessage', generateMessage('administrator', 'Someone joins the chat room!'));

	socket.on('createMessage', (message, callback) => {
		if(message.from && message.text) {
			console.log(`newMessage from ${message.from}: ${message.text}`);
			io.emit('newMessage', generateMessage(message.from, message.text));
			callback('From Server: Text Message Acknowledged');
		} else {
			callback('From Server: Text Message Denied');
		}
	});

	socket.on('createLocationMessage', (message, callback) => {
		if(message.from && message.latitude && message.longitude) {
			console.log(`newMessage from ${message.from}: latitude: ${message.latitude}, longtitude: ${message.longitude}`);
			io.emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude));
			callback('From Server: Geolocation Message Acknowledged');
		} else {
			callback('From Server: Geolocation Message Denied');
		}
	});

	socket.on('disconnect', () => {
		console.log(`User Disconnect at ${new Date().getTime()}. Socket #: ${socket.id}`);
	});
});

server.listen(portNum, () => {
	console.log(`Server is up on port ${portNum}`);
	console.log(`Server Diretory Name: ${publicPath}`);
});