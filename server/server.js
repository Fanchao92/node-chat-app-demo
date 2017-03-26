const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '..', 'public');
const portNum = process.env.PORT || 3000;

var app = express();

app.use(express.static(publicPath));

app.listen(portNum, () => {
	console.log(`Server is up on port ${portNum}`);
	console.log(`Server Diretory Name: ${publicPath}`);
});