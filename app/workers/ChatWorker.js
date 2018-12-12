/* Polyfill these objects and methods that are used (but not depended on) by included modules */

self.window = self;

self.document = { 
  createElement: function(){} 
};

import XMPP from 'stanza.io';

let client;

onmessage = function(e) {
  const type = e.data[0];
  const args = e.data.slice(1);
  // console.log('chat worker received message: ' + type);
  switch(type) {
    case 'connect':
      connect(...args);
      break;
    case 'disconnect':
      disconnect();
      break;
    case 'getSearchHistory':
      getSearchHistory(...args);
      break;
    case 'sendMessage':
      sendMessage(...args);
      break;
    case 'ping':
      postMessage(['pong']);
      break;
    default:
      break;
  }
}

function connect(jid, password) {

  client = XMPP.createClient({
    jid,
    password,
    transport: 'websocket',
    server: process.env.CHAT_SERVER,
    wsURL: process.env.CHAT_WS_URL,
  });


  function onSessionStarted() {
    client.sendPresence();
    client.enableCarbons();
  }

  function onPresence() {
    client.releaseGroup('connection');
    client.on('disconnected', 'events', onDisconnected);
    client.on('chat', 'events', onMessageReceived);
    client.on('message:sent', 'events', onMessageSent);
    postMessage(['connected']);
  }

  function onError() {
    client.releaseGroup('connection');
    postMessage(['connectionError']);
  }

  clearEvents();
  client.on('session:started', 'connection', onSessionStarted);
  client.on('presence', 'connection', onPresence);
  client.on('session:error', 'connection', onError);
  client.on('presence:error', 'connection', onError);
  client.on('disconnected', 'connection', onError);
  /* Uncomment to debug */
  /*client.on('*', function(name, data) {
    console.log(name);
    if (typeof data == "object") {
      var seen = [];
      data = JSON.stringify(data, function(key, val) {
         if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                  return;
              }
              seen.push(val);
          }
          return val;
      });
    }
    //console.log(data);
  });*/

  client.connect();
  client.enableKeepAlive({
    interval: 4,
    timeout: 2,
  });

  /* Uncomment to debug */
  /*client.on('raw:incoming', (xml) => {
     console.log('[Chat: Incoming]', xml);
  });

  client.on('raw:outgoing', (xml) => {
    console.log('[Chat: Outgoing]', xml);
  });*/
}

function clearEvents(){
  client.releaseGroup('connection');
  client.releaseGroup('events');
}

function disconnect(){
  clearEvents();
  client.disconnect();
}

function getSearchHistory(jid) {
  client.searchHistory({ with: jid, rsm: {max: -1, before: true}}, (err, messages) => {
    if (err) postMessage(['getSearchHistoryFailed'/*, {err: err}*/]);
    else postMessage(['getSearchHistorySuccess', messages]);
  });
}

function sendMessage(jid, body) {
  return client.sendMessage({ 
    to: jid,
    type: 'chat',
    body 
  });
}

function onDisconnected(arg) {
  postMessage(['disconnected']);
}

function onMessageReceived(message) {
  postMessage(['messageReceived', message]);
}

function onMessageSent(message) {
  postMessage(['messageSent', message]);
}