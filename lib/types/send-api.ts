export interface Recipient {
  id: string;
}

export interface MultimediaPayload {
  url: string;
}

export interface LocationPayload {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type FallbackPayload = null;

export interface ImageAttachment {
  type: 'image';
  payload: MultimediaPayload;
}

export interface AudioAttachment {
  type: 'audio';
  payload: MultimediaPayload;
}

export interface VideoAttachment {
  type: 'video';
  payload: MultimediaPayload;
}

export interface FileAttachment {
  type: 'file';
  payload: MultimediaPayload;
}

export interface LocationAttachment {
  type: 'file';
  payload: LocationPayload;
}

export interface FallbackAttachment {
  type: 'fallback';
  payload: FallbackPayload;
}

export type Attachment =
  | ImageAttachment
  | AudioAttachment
  | VideoAttachment
  | FileAttachment
  | LocationAttachment;

export interface Message {
  recipient: Recipient;
  message?: {
    text?: string;
    attachment?: Attachment;
    quick_replies?: any[];
    metadata?: string;
  };
  sender_action?: string;
  notification_type?: string;
  tag?: string;
}

export type SenderAction = 'typing_on' | 'typing_off' | 'mark_seen';
export type NotificaionType = 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH';
export interface Button {
  type: 'web_url' | 'postback';
  url: string;
  title: string;
  payload?: string;
}

export interface GenericTemplateAttachment {
  type: 'template';
  payload: {
    template_type: 'generic';
    elements: Array<{
      title: string;
      image_url: string;
      subtitle: string;
      default_action?: {
        type: 'web_url';
        url: string;
        messenger_extensions: boolean;
        webview_height_ratio: 'COMPACT' | 'TALL' | 'FULL';
      };
      buttons?: Button[];
    }>;
  };
}
