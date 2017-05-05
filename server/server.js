const express = require('express');
const http = require('http');
const shortid = require('shortid');
const WebSocket = require('ws');
const Rx = require('rxjs');

const app = express();

app.use(function (req, res) {
  res.send({msg: "hello"});
});

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const connectedUserIDs = [];
const socketMsg$ = new Rx.Subject();
socketMsg$.subscribe(msg => {
  console.log('received: %s', msg);
})

wss.on('connection', function connection(ws) {
  const userID = shortid.generate();
  connectedUserIDs.push(userID);
  console.log('connected: %s', userID);
  ws.send(JSON.stringify({userID, "status": "ok"}));
  ws.on('message', msg => socketMsg$.next(msg));
});

server.listen(8080, () => console.log('Listening on %d', server.address().port));
