'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const firebase = require("firebase/app");
require("firebase/database");

// create LINE SDK conf ig from env variables
const config = {
  channelAccessToken: 'rqGxbcMnaBA0q1qukvP5d8uIhberyvEQch+aJFJYSDt4qh6JhNmoXTB4SoSC62zYpAYCm9f/eRSOaRAK8Ht+OVsyX8bPXZn70IXB3ZROCP9cnnUbJHIzCVWe94GKgU+V6XOocahem92oS2UbwRB//wdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'd23d58f058dcae4fe4e383732e23bc1d',
};

// create LINE SDK client
const client = new line.Client(config);

const firebaseConfig = {
  apiKey: "AIzaSyAgH3bdr8u3oXpIa4UeZYsoYuGT9dGc_xY",
  authDomain: "cheatingbot-992eb.firebaseapp.com",
  databaseURL: "https://cheatingbot-992eb.firebaseio.com",
  projectId: "cheatingbot-992eb",
  storageBucket: "",
  messagingSenderId: "192740474850"
};
firebase.initializeApp(firebaseConfig);

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
  
  const userId = event.source.userId;
  const ref = firebase.database().ref("users").child(userId);
  const modeRef = firebase.database().ref("mode").child(userId);
  var bossMode;

  function responseBossMode() {
    changeMode(true);
    const bossText = [
      { type: 'text', text:'Dua petugas jaga Situs Warungboto, Kota Yogyakarta, mendadak sibuk pada medio September 2017. ' },
      { type: 'text', text: 'Pasalnya, mereka dapat info dari Badan Pelestarian Cagar Budaya (BPCB) DIY tentang rencana penggunaan area situs itu untuk sesi pemotretan pre-wedding anak Presiden Jokowi, Kahiyang Ayu (26), dan calon suaminya, Bobby Afif Nasution (26). ' },
      { type: 'text', text: 'Informasi tersebut datang tiba-tiba, plus tanpa keterangan waktu. "Pokoknya, kita diminta siap-siap pada Senin dan Selasa (11-12 September 2017)," kata petugas jaga--menolak namanya dipublikasikan--kepada Beritagar.id, di Situs Warungboto, Selasa (24/10/2017).' },
      { type: 'text', text: 'Mereka pun bergegas bersih-bersih wilayah situs. Satu kamar mandi milik warga juga dipersiapkan untuk keperluan rombongan Kahiyang dan Bobby.' }
    ]
    client.replyMessage(event.replyToken, bossText);
  }


  function responseNoBossMode() {
    changeMode(false);
    client.replyMessage(event.replyToken, { type: 'text', text: 'OK' });
  }

  function responseSave(message) {
    if(bossMode==false) {
      const key = message[1];
      const data = message[2];

      ref.push({
        key: key,
        data: data
      })
      client.replyMessage(event.replyToken, { type: 'text', text: 'OK' });
    }
  }

  function responseProfile() {
    client.getProfile(userId).then(function(profile){
      const text = "Halo " + profile.displayName + ", ini user ID kamu + " + profile.userId;
      client.replyMessage(event.replyToken, { type: 'text', text });
    })
  }

  function responseLoad(message) {
    if(bossMode==false) {
      const messageKey = message[1];
      
      ref.on("value", function(snapshot) {
        var obj = snapshot.val();
        var objects = Object.keys(obj).map(function(key) {
          return [Number(key), obj[key]];
        });
        objects.forEach(function(object){
          if(object[1].key==messageKey) {
            client.replyMessage(event.replyToken, { type: 'text', text: object[1].data });
          }
        })
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  }

  function changeMode(mode) {
    modeRef.set({
      boss: mode
    })
  }

  function getMode() {
    modeRef.on("value", function(snapshot) {
      var obj = snapshot.val();
      bossMode = obj.boss;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  var message = event.message.text.split(" ");
  const command = message[0].toLowerCase();
  switch(command) {
    case 'boss':
      return responseBossMode();
    case 'noboss':
      return responseNoBossMode();
    case 'save':
      return responseSave(message);
    case 'profile':
      return responseProfile();
    case 'load':
      return responseLoad(message);
    default:
      return;
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
