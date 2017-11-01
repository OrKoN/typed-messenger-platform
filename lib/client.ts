import r2 = require('r2');
import debug = require('debug');
import * as sendApi from './types/send-api';

const dbg = debug('messenger-platform');

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

export function messageTo(recipient: sendApi.Recipient): MessageBuilder {
  return new MessageBuilder(recipient);
}

export class MessageBuilder implements sendApi.Message {
  recipient: sendApi.Recipient;
  message?: {
    text?: string;
    attachment?: sendApi.Attachment;
    quick_replies?: any[];
    metadata?: string;
  };
  sender_action?: sendApi.SenderAction;
  notification_type?: string;
  tag?: string;

  constructor(recipient: sendApi.Recipient) {
    this.recipient = recipient;
  }

  text(text: string) {
    if (!this.message) {
      this.message = {};
    }
    this.message.text = text;
    return this;
  }

  action(action: sendApi.SenderAction) {
    this.sender_action = action;
    return this;
  }

  image(url: string, is_reusable = true) {
    if (!this.message) {
      this.message = {};
    }
    this.message.attachment = {
      type: 'image',
      payload: {
        url,
        is_reusable,
      },
    };
    return this;
  }

  quickTextReply(title: string, payload?: string, imageUrl?: string) {
    if (!this.message) {
      this.message = {};
    }
    if (!this.message.quick_replies) {
      this.message.quick_replies = [];
    }
    this.message.quick_replies.push({
      content_type: 'text',
      title,
      image_url: imageUrl,
      payload: payload,
    });
    return this;
  }

  quickLocationReply() {
    if (!this.message) {
      this.message = {};
    }
    if (!this.message.quick_replies) {
      this.message.quick_replies = [];
    }
    this.message.quick_replies.push({
      content_type: 'location',
    });
    return this;
  }
}
