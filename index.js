'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK conf ig from env variables
const config = {
  channelAccessToken: 'rqGxbcMnaBA0q1qukvP5d8uIhberyvEQch+aJFJYSDt4qh6JhNmoXTB4SoSC62zYpAYCm9f/eRSOaRAK8Ht+OVsyX8bPXZn70IXB3ZROCP9cnnUbJHIzCVWe94GKgU+V6XOocahem92oS2UbwRB//wdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'd23d58f058dcae4fe4e383732e23bc1d',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // switch(message.toLowerCase()) {
  //   case 'boss':
  //     return client.replyMessage(event.replyToken, { type: 'text', text: 'boss mode' });
  //     break;
  //   case 'noboss':
  //     return client.replyMessage(event.replyToken, { type: 'text', text: 'no boss mode' });
  //     break;
  //   default:
  //     return;
  // }

  // create a echoing text message
  const echo = { type: 'text', text: 'paandah' };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
