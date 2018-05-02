import express from 'express'
import http from 'http'
import RethinkdbWebsocketServer from 'rethinkdb-websocket-server'

var app = express();
app.use('/', express.static('assets'));
var httpServer = http.createServer(app);

// Configure rethinkdb-websocket-server to listen on the /db path and proxy
// incoming WebSocket connections to the RethinkDB server running on localhost
// port 28015. Because unsafelyAllowAnyQuery is true, any incoming query will
// be accepted (not safe in production).
RethinkdbWebsocketServer.listen({
	httpServer: httpServer,
	httpPath: '/db',
	dbHost: 'localhost',
	dbPort: 28015,
	unsafelyAllowAnyQuery: true,
});

// Start the HTTP server on port 8015
httpServer.listen(8015);
console.log('Listening on port 8015');