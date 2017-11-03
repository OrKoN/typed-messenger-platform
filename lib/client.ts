import * as sendApi from './types/send-api';
import dbg = require('./dbg');
import r2 = require('r2');

export async function sendMessage(token: string, json: sendApi.Message) {
  dbg('sending message %j', json);

  const result = await r2.post(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${token}`,
    {
      json,
    },
  ).json;

  dbg('response %j', result);

  return result;
}
