"use strict";

process.title = 'node-chat'; // ps, top title

const { port:_port, userColors: _colors } = require("./application-properties");

const webSocketServer = require('websocket').server;
const http = require('http');

let history = [];
let clients = [];

const _log = (t,y) => {
    let stmp = new Date();
    console.log(y+':'+`${stmp.getFullYear()}${stmp.getMonth()}${stmp.getUTCDay()}:${stmp.getHours()}:${stmp.getMinutes()}:${stmp.getSeconds()}:${stmp.getMilliseconds()}`+' '+t)
}
const LOGGER = { log: t => _log(t,'[Log]'), warn: t => _log(t,'[Warn]'), error:t => _log(t,'[Error]') };

const htmlEntities = str => String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const server = http.createServer( (req, res) => {} );
server.listen(_port, LOGGER.log(`listening at port ${_port}`));

// WebSocket server
const wsServer = new webSocketServer({ httpServer: server });

const EventEnum = {
    REQUEST: 'request',
    MESSAGE: 'message',
    CLOSE: 'close'
}

wsServer.on(EventEnum.REQUEST, request => {
  LOGGER.log(`Host from ${request.origin}.`);

  let connection = request.accept(null, request.origin); 
  let index = clients.push(connection) - 1;
  let userName = false;
  let userColor = false;
  LOGGER.log(`Connection accepted.`);

  if (history.length > 0) {
    connection.sendUTF(JSON.stringify({ type: 'history', data: history}));
  }

  connection.on(EventEnum.MESSAGE, message => {
    if (message.type === 'utf8') {
        if (userName === false) {
        userName = htmlEntities(message.utf8Data);
        userColor = _colors.shift();
        connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
        LOGGER.warn(`${userName} < color ${userColor}`);
      } else {
        LOGGER.error(`Received Message from ${userName}: ${message.utf8Data}`);
        
        let obj = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
          color: userColor
        };
        history.push(obj);
        history = history.slice(-100);
        let json = JSON.stringify({ type:'message', data: obj });

        for (let i=0; i < clients.length; i++)
          clients[i].sendUTF(json);
      }
    }
  });
  // user disconnected
  connection.on(EventEnum.CLOSE, conn => {
    if (userName !== false && userColor !== false) {
      LOGGER.log(`${conn.remoteAddress} desconectado`);
      clients.splice(index, 1);
      _colors.push(userColor);
    }
  });
});