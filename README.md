simples-redirect is a middleware to redirect connections to a specific protocol.

#### Recommended for [simpleS 0.7+](http://micnic.github.com/simpleS/)

## Instalation

    npm install simples-redirect

## Usage

```js
var simples = require('simples'),
    redirect = require('simples-redirect');

var server = simples();

server.middleware(redirect({
    headers: {
        'X-Powered-By': 'simpleS'
    },
    pattern: /^\/secured\/.*$/i,
    permanent: true,
    protocol: 'https'
}));
```

## Options

`headers` : object - Headers to be set to the connection redirect, by default is an empty object

`pattern` : regexp - Regular expression pattern to match the redirected locations, by default is `/^.+$/i`

`permanent` : boolean - Set status code as `301` for permanent redirects and `302` - otherwise, by default is false

`protocol`: 'http' | 'https' - Set the prefered protocol to switch, by default is `http`