import * as webhookApi from './types/webhook-api';
import bodyParser = require('koa-bodyparser');
import dbg = require('./dbg');
import events = require('events');
import Koa = require('koa');
import http = require('http');

export function createServer(cfg: Config): Server {
  return new Server(cfg);
}

export enum HandlerType {
  text = 'text',
  location = 'location',
  audio = 'audio',
  video = 'video',
  file = 'file',
  image = 'image',
  any = 'any',
  unknown = 'unknown',
}

export interface Handlers {
  [key: string]: EventHandlerFn[];
}

export class Server extends events.EventEmitter {
  handlers: Handlers = {};
  app: Koa;
  cfg: Config;

  constructor(cfg: Config) {
    super();
    this.cfg = cfg;
    this.app = new Koa();
    this._setupMiddleware();
  }

  onTextMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.text, handler);
  }

  onLocationMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.location, handler);
  }

  onAudioMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.audio, handler);
  }

  onVideoMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.video, handler);
  }

  onFileMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.file, handler);
  }

  onImageMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.image, handler);
  }

  onAnyMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.any, handler);
  }

  onUnknownMessage(handler: EventHandlerFn) {
    return this._addHandler(HandlerType.unknown, handler);
  }

  done(): Serverfn {
    return this.app.callback();
  }

  _addHandler(type: HandlerType, handler: EventHandlerFn) {
    this.handlers[type] = [...(this.handlers[type] || []), handler];
    return this;
  }

  _setupMiddleware() {
    const app = this.app;

    app.use(bodyParser());
    app.use(this._getErrorHandler());
    app.use(this._getVerificationRequestHandler());
    app.use(this._getMessageHandler());
  }

  _getVerificationRequestHandler() {
    return async (ctx: Koa.Context, next: Function) => {
      if (ctx.method === 'GET') {
        return this._handleVerificationRequest(ctx, this.cfg.verificationToken);
      }
      await next();
    };
  }

  _getMessageHandler() {
    return async (ctx: Koa.Context) => {
      if (
        ctx.request.body &&
        (<webhookApi.WebhookEvent>ctx.request.body).object === 'page'
      ) {
        await this._handleEvent(ctx.request.body);
        ctx.status = 200;
        ctx.body = 'EVENT_RECEIVED';
      }
    };
  }

  _getErrorHandler() {
    return async (ctx: Koa.Context, next: Function) => {
      try {
        await next();
      } catch (err) {
        this.emit('error', err);
        dbg('error handling a request %j', err);
        ctx.status = 500;
        ctx.body = err.message;
      }
    };
  }

  async _handleVerificationRequest(
    ctx: Koa.Context,
    verificationToken: string,
  ) {
    if (
      ctx.query['hub.mode'] &&
      ctx.query['hub.verify_token'] &&
      ctx.query['hub.mode'] === 'subscribe' &&
      ctx.query['hub.verify_token'] === verificationToken
    ) {
      ctx.status = 200;
      ctx.body = ctx.query['hub.challenge'];
    } else {
      ctx.status = 403;
    }
  }

  _isTextMessage(event: webhookApi.MessageReceivedEvent) {
    return event.message !== undefined && event.message.text !== undefined;
  }

  _isLocationMessage(event: webhookApi.MessageReceivedEvent) {
    return (
      event.message !== undefined &&
      event.message.attachments !== undefined &&
      event.message.attachments.some(a => a.type === 'location')
    );
  }

  _isAudioMessage(event: webhookApi.MessageReceivedEvent) {
    return (
      event.message !== undefined &&
      event.message.attachments !== undefined &&
      event.message.attachments.some(a => a.type === 'audio')
    );
  }

  _isVideoMessage(event: webhookApi.MessageReceivedEvent) {
    return (
      event.message !== undefined &&
      event.message.attachments !== undefined &&
      event.message.attachments.some(a => a.type === 'video')
    );
  }

  _isImageMessage(event: webhookApi.MessageReceivedEvent) {
    return (
      event.message !== undefined &&
      event.message.attachments !== undefined &&
      event.message.attachments.some(a => a.type === 'image')
    );
  }

  _isFileMessage(event: webhookApi.MessageReceivedEvent) {
    return (
      event.message !== undefined &&
      event.message.attachments !== undefined &&
      event.message.attachments.some(a => a.type === 'file')
    );
  }

  _getMessageType(msg: webhookApi.MessageEvent): HandlerType {
    if (this._isTextMessage(msg)) {
      return HandlerType.text;
    } else if (this._isLocationMessage(msg)) {
      return HandlerType.location;
    } else if (this._isAudioMessage(msg)) {
      return HandlerType.audio;
    } else if (this._isVideoMessage(msg)) {
      return HandlerType.video;
    } else if (this._isFileMessage(msg)) {
      return HandlerType.file;
    } else if (this._isImageMessage(msg)) {
      return HandlerType.image;
    }
    return HandlerType.unknown;
  }

  async _handleEvent(event: webhookApi.WebhookEvent): Promise<any> {
    for (let entry of event.entry) {
      for (let msg of entry.messaging) {
        dbg('webhoook message received %j', msg);
        const type = this._getMessageType(msg);
        dbg('webhoook message type %j', type);
        await this._executeHandlers(msg, this.handlers[type]);
        if (type !== HandlerType.unknown) {
          await this._executeHandlers(msg, this.handlers[HandlerType.any]);
        }
      }
    }
  }

  async _executeHandlers(
    event: webhookApi.MessageReceivedEvent,
    handlers: EventHandlerFn[],
  ) {
    for (const handler of handlers || []) {
      try {
        await handler(event);
      } catch (err) {
        this.emit('error', err);
      }
    }
  }
}

export interface Config {
  verificationToken: string;
}

export type EventHandlerFn = (
  msg: webhookApi.MessageReceivedEvent,
) => Promise<any>;

export type Serverfn = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
) => void;
