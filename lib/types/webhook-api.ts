export interface Sender {
  id: string;
}

export interface Recipient {
  id: string;
}

export interface MultimediaPayload {
  url: string;
}

export interface LocationPayload {
  coordinates: {
    lat: number;
    long: number;
  };
}

export type FallbackPayload = null;

export interface ImageAttachment {
  type: 'image';
  url: string;
  payload: MultimediaPayload;
}

export interface AudioAttachment {
  type: 'audio';
  url: string;
  payload: MultimediaPayload;
}

export interface VideoAttachment {
  type: 'video';
  url: string;
  payload: MultimediaPayload;
}

export interface FileAttachment {
  type: 'file';
  url: string;
  payload: MultimediaPayload;
}

export interface LocationAttachment {
  type: 'location';
  title: string;
  url: string;
  payload: LocationPayload;
}

export interface FallbackAttachment {
  type: 'fallback';
  title: string;
  url: string;
  payload: FallbackPayload;
}

export type Attachment =
  | ImageAttachment
  | AudioAttachment
  | VideoAttachment
  | FileAttachment
  | LocationAttachment
  | FallbackAttachment;

export interface MessageReceivedEvent {
  sender: Sender;
  recipient: Recipient;
  timestamp: number;
  message: {
    mid: string;
    seq: number;
    text?: string;
    quick_reply?: {
      payload: string;
    };
    attachments?: Attachment[];
  };
}

export type MessageEvent = MessageReceivedEvent;

export interface WebhookEntry {
  id: string;
  time: number;
  messaging: Array<MessageEvent>;
}

export interface WebhookEvent {
  object: 'page';
  entry: WebhookEntry[];
}
