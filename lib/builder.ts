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

  audio(url: string, is_reusable = true) {
    this.message = {
      ...this.message,
      attachment: {
        type: 'audio',
        payload: {
          url,
          is_reusable,
        },
      },
    };
    return this;
  }

  video(url: string, is_reusable = true) {
    this.message = {
      ...this.message,
      attachment: {
        type: 'video',
        payload: {
          url,
          is_reusable,
        },
      },
    };
    return this;
  }

  file(url: string, is_reusable = true) {
    this.message = {
      ...this.message,
      attachment: {
        type: 'file',
        payload: {
          url,
          is_reusable,
        },
      },
    };
    return this;
  }

  buttons(text: string, buttons: sendApi.ButtonTemplateButton[]) {
    this.message = {
      ...this.message,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons,
        },
      },
    };
    return this;
  }

  genericTemplate(
    elements: sendApi.GenericTemplateElement[],
    imageAspectRatio: sendApi.ImageAspectRatio = 'horizontal',
    sharable = false,
  ) {
    this.message = {
      ...this.message,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          sharable,
          image_aspect_ratio: imageAspectRatio,
          elements,
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

  notification(type: sendApi.NotificaionType) {
    this.notification_type = type;
    return this;
  }

  taggedWith(tag: string) {
    this.tag = tag;
    return this;
  }

  metadata(metadata: string) {
    this.message = {
      ...this.message,
      metadata,
    };
    return this;
  }
}
