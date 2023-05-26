'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

const OPENAPI_KEY = process.env.OPENAPI_KEY

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用
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

  let message = event.message.text;

  // 豚山が含まれているか
  if (!message.match(/豚山/)) {
    return
  }

  // 豚山をラーメンに置換
  message = message.replaceAll(/豚山/g, 'ラーメン屋')

  // はいかいいえで答えるようにメッセージを追加する
  message = "「" + message + "」と発言している人は、ラーメン屋に行きたいと思っていますか。\n"
              +   "「はい」か「いいえ」で答えてください"

  const requestOptions = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer "+ OPENAPI_KEY
    },
    "payload": JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
          {"role": "user", "content": message}
      ]
    })
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((res) => {
      return res.json()
    })
  const text = response['choices'][0]['message']['content'].trim();

  let replyMessage;
  if (text.match(/はい/)) {
    replyMessage = "いいですねえ！他に行きたい人いますか？"
  } else if (text.match(/いいえ/)) {
    replyMessage = "何言ってるんですか！！"
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyMessage
  });


  // let replyText = '';
  // if (message.includes('豚山行く')){
  //     replyText = 'ようこそ！豚山へ！';
  //     return client.replyMessage(event.replyToken, {
  //     type: 'text',
  //     text: replyText
  // });
  // }
  // else if(message.includes('豚山行かへん？')){
  //     replyText = '行ってやってもええで';
  //     return client.replyMessage(event.replyToken, {
  //     type: 'text',
  //     text: replyText
  // });
  // }
  // else if(message.includes('🐖🗻')){
  //   replyText = '豚山行きたいです！';
  //   return client.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: replyText
  // });
  // }
  // else if(message.includes('豚山')){
  //   var random = Math.random()
  //   if(random <0.5){
  //     replyText = 'そろそろ豚山行きたくなってきた？';
  //     return client.replyMessage(event.replyToken, {
  //     type: 'text',
  //     text: replyText
  //     });
  //   }
  //   else if(random >= 0.5 && random < 0.9){
  //     replyText = '豚山行きたいです！';
  //     return client.replyMessage(event.replyToken, {
  //     type: 'text',
  //     text: replyText
  //     });
  //   }
  //   else if(random > 0.9){
  //     replyText = '豚山はほどほどにしとき…';
  //     return client.replyMessage(event.replyToken, {
  //     type: 'text',
  //     text: replyText
  //     });
  //   }
  // }
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);