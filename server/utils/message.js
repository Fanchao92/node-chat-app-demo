const moment = require('moment');

var date = moment();

var generateMessage = function(from, text) {
	return {
		from,
		text,
		createdAt: date.valueOf()
	};
} 

var generateLocationMessage = function(from, lat, long) {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat},${long}`,
		createdAt: date.valueOf()
	};
}

module.exports = {
	generateMessage,
	generateLocationMessage
};