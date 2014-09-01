'use strict';

// Check for a plain object
function isObject(object) {

	var prototype = Object.prototype.toString;

	return prototype.call(object) === '[object Object]';
}

// Set the new connection location
function redirectConnection(connection, protocol, permanent) {

	var location = protocol + '://' + connection.url.host + connection.url.path;

	// Redirect the connection
	connection.redirect(location, permanent);
}

// Set the provided headers to the connection
function setHeaders(connection, headers) {
	Object.keys(headers).forEach(function (header) {
		connection.header(header, headers[header]);
	});
}

// Export the middleware builder
module.exports = function (options) {

	var headers = {},
		pattern = /^.+$/i,
		permanent = false,
		protocol = 'http';

	// Check if the options parameter is a plain object
	if (!isObject(options)) {
		options = {};
	}

	// Prepare headers option
	if (isObject(options.headers)) {
		headers = options.headers;
	}

	// Prepare pattern option
	if (options.pattern instanceof RegExp) {
		pattern = options.pattern;
	}

	// Prepare permanent option
	if (options.permanent === true) {
		permanent = true;
	}

	// Prepare protocol option
	if (options.protocol === 'https') {
		protocol = 'https';
	}

	return function (connection, next) {
		if (connection.protocol !== protocol && pattern.test(connection.path)) {
			setHeaders(connection, headers);
			redirectConnection(connection, protocol, permanent);
			next(true);
		} else {
			next();
		}
	};
};