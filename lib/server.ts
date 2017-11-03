import * as webhookApi from './types/webhook-api';
import bodyParser = require('koa-bodyparser');
import dbg = require('./dbg');
import events = require('events');
import Koa = require('koa');
import http = require('http');

export function createServer(cfg: Config): Server {
  return new Server(cfg);
}

export class Server extends events.EventEmitter {
  handlers: {
    onTextMessage: EventHandlerFn[];
    onLocationMessage: EventHandlerFn[];
  };
  app: Koa;
  cfg: Config;

  constructor(cfg: Config) {
    super();
    this.cfg = cfg;
    this.app = new Koa();
    this.handlers = {
      onTextMessage: [],
      onLocationMessage: [],
    };
    this._setupMiddleware();
  }

  onTextMessage(handler: EventHandlerFn) {
    this.handlers.onTextMessage.push(handler);
    return this;
  }

  onLocationMessage(handler: EventHandlerFn) {
    this.handlers.onLocationMessage.push(handler);
    return this;
  }

  done(): Serverfn {
    return this.app.callback();
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
        await this._handleEvent(ctx.request.body, this.handlers);
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

  isTextMessage(event: webhookApi.MessageReceivedEvent) {
    return event.message !== undefined && event.message.text !== undefined;
  }

  isLocationMessage(event: webhookApi.MessageReceivedEvent) {
    return (
      event.message !== undefined &&
      event.message.attachments !== undefined &&
      event.message.attachments.some(a => a.type === 'location')
    );
  }

  async _handleEvent(
    event: webhookApi.WebhookEvent,
    handlers: {
      onTextMessage: EventHandlerFn[];
      onLocationMessage: EventHandlerFn[];
    },
  ): Promise<any> {
    for (let entry of event.entry) {
      for (let msg of entry.messaging) {
        dbg('webhoook message received %j', msg);
        if (this.isTextMessage(msg)) {
          await this._executeHandlers(msg, handlers.onTextMessage);
        } else if (this.isLocationMessage(msg)) {
          await this._executeHandlers(msg, handlers.onLocationMessage);
        }
      }
    }
  }

  async _executeHandlers(
    event: webhookApi.MessageReceivedEvent,
    handlers: EventHandlerFn[],
  ) {
    for (const handler of handlers) {
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
