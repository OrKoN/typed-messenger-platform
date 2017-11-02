import * as sendApi from './types/send-api';

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
    this.message = {
      ...this.message,
      text,
    };
    return this;
  }

  action(action: sendApi.SenderAction) {
    this.sender_action = action;
    return this;
  }

  image(url: string, is_reusable = true) {
    this.message = {
      ...this.message,
      attachment: {
        type: 'image',
        payload: {
          url,
          is_reusable,
        },
      },
    };
    return this;
  }

  quickTextReply(title: string, payload?: string, imageUrl?: string) {
    this.message = {
      ...this.message,
      quick_replies: [
        ...((this.message || {}).quick_replies || []),
        {
          content_type: 'text',
          title,
          image_url: imageUrl,
          payload: payload,
        },
      ],
    };
    return this;
  }

  quickLocationReply() {
    this.message = {
      ...this.message,
      quick_replies: [
        ...((this.message || {}).quick_replies || []),
        {
          content_type: 'location',
        },
      ],
    };
    return this;
  }
}
