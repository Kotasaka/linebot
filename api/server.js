'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '04a08918ce9fdee3de62bfe6e13304a1',
    channelAccessToken: 'BXviARACRnlidsy0aRwGhDyxR+0659sDtINImWoiJtwPiDKmk80fA7obiLKeJae7JBqjOqJS1ua5i85sWLtNzg4tIcYdlKal++5dc9yQusFijwRm6+mGW0AqrqYQvhm6XXJkJ202yAPZoeTcumXOpgdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = event.message.text;
  //"豚山行く？"以外の場合は反応しない
  // if(event.message.text !== '豚山行く？') {
  //   return client.replyMessage(event.replyToken, {
  //     type: 'text',
  //   });
  // }

  let replyText = '';
  if (message.includes('豚山行く')){
      replyText = 'ようこそ！豚山へ！'; //"行きたい！！"ってメッセージを送信
      return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
  });
  }
  else if(message.includes('豚山行かへん？')){
      replyText = '行ってやってもええで'; //"行きたい！！"ってメッセージを送信
      return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
  });
  }
  else if(message.includes('🐖🗻')){
    replyText = '豚山行きたいです！'; //"行きたい！！"ってメッセージを送信
    return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
  }
  else if(message.includes('豚山')){
    replyText = '豚山行きたいです！'; //"行きたい！！"ってメッセージを送信
    return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
  }
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);