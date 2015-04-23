'use strict';

// Check for a plain object
function isObject(object) {
	return Object.prototype.toString.call(object) === '[object Object]';
}

// Set the new connection location
function redirectConnection(connection, protocol, permanent) {

	var location = protocol + '://' + connection.url.host + connection.url.path;

	// Redirect the connection
	connection.redirect(location, permanent);
}

// Export the middleware builder
module.exports = function (options) {

	var headers = [],
		pattern = /^.+$/i,
		permanent = false,
		protocol = 'http',
		values = [];

	// Check if the options parameter is a plain object
	if (!isObject(options)) {
		options = {};
	}

	// Prepare headers option
	if (isObject(options.headers)) {
		Object.keys(options.headers).forEach(function (header) {
			headers.push(header);
			values.push(options.headers[header]);
		});
	}

	// Prepare pattern option
	if (options.pattern instanceof RegExp) {
		pattern = options.pattern;
	} else if (typeof options.pattern === 'string') {
		pattern = RegExp(options.pattern, 'i');
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

			// Set the headers only if they are defined
			if (headers.length) {
				headers.forEach(function (header, index) {
					connection.header(header, values[index]);
				});
			}

			// Redirect the connection
			redirectConnection(connection, protocol, permanent);

			// Stop the middleware chain
			next(true);
		} else {
			next();
		}
	};
};