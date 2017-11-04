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

  const bossText1 = {type: 'text', text:'Dua petugas jaga Situs Warungboto, Kota Yogyakarta, mendadak sibuk pada medio September 2017. '}
  const bossText2 = {type: 'text', text: 'Pasalnya, mereka dapat info dari Badan Pelestarian Cagar Budaya (BPCB) DIY tentang rencana penggunaan area situs itu untuk sesi pemotretan pre-wedding anak Presiden Jokowi, Kahiyang Ayu (26), dan calon suaminya, Bobby Afif Nasution (26). '}
  const bossText3 = {type: 'text', text: 'Informasi tersebut datang tiba-tiba, plus tanpa keterangan waktu. "Pokoknya, kita diminta siap-siap pada Senin dan Selasa (11-12 September 2017)," kata petugas jaga--menolak namanya dipublikasikan--kepada Beritagar.id, di Situs Warungboto, Selasa (24/10/2017).'}
  const bossText4 = {type: 'text', text: 'Mereka pun bergegas bersih-bersih wilayah situs. Satu kamar mandi milik warga juga dipersiapkan untuk keperluan rombongan Kahiyang dan Bobby.'}

  function replyForBossMode() {
    client.replyMessage(event.replyToken, bossText1);
    client.replyMessage(event.replyToken, bossText2);
    client.replyMessage(event.replyToken, bossText3);
    client.replyMessage(event.replyToken, bossText4);
  }

  switch(event.message.text.toLowerCase()) {
    case 'boss':
      return replyForBossMode();
      break;
    case 'noboss':
      return client.replyMessage(event.replyToken, { type: 'text', text: 'OK' });
      break;
    default:
      return;
  }

  // create a echoing text message
  // const echo = { type: 'text', text: 'paandah' };

  // use reply API
  // return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
