# typed-messenger-platform

Toolkit for developing applications for the [Messenger platform](https://developers.facebook.com/docs/messenger-platform) written in TypeScript.

### State

In active development. Feel free to open an issue if you would like to contribute or check out existing issues https://github.com/OrKoN/typed-messenger-platform/issues.

### Principles

 - follow the original API as closely as possible and provide type information
 - de-couple server (for receiving webhooks), client (for sending messages etc) and message builder parts (POJO)

### Goals

 - full support for [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api), [message received events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages), [messaging_postbacks](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_postbacks) (not fully implemented yet)
 - helpers to de-duplicate and queue messages
 - the support for the rest of APIs if required


## Setup

To interact with the messenger platform you require a fb app connected to a page. Set up a webhook connecting the page with your server.

## Usage

```sh
npm i typed-messenger-platform
```

Echo bot:

```typescript
import http = require('http');
import * as platform from 'typed-messenger-platform';

const PAGE_TOKEN = 'TOKEN';

const { sendMessage, messageTo } = platform;

const fbServer = platform
  // initial configuration is passed via createServer
  .createServer({
    verificationToken: 'YOUR TOKEN',
  })
  // handle messages of specific types with .onTextMessage, .onLocationMessage etc
  .onTextMessage(
    async (testMessage: platform.webhookApi.MessageReceivedEvent) => {
      // decide
      // - when to construct a message (with the builder interface `messageTo`)
      // - when to actually send a message (with `sendMessage` call)
      // - whether to process synchronously or concurrently (with await)
      await sendMessage(
        PAGE_TOKEN,
        messageTo(testMessage.sender).text(
          testMessage.message.text || 'No message',
        ),
      );
    },
  );

// call .done to get node http compatible handler
http.createServer(fbServer.done()).listen(3000);

// monitor errors asynchronously
fbServer.on('error', (err: Error) => {
  console.log('error', err);
})

```

Message builder interface allows chaining calls to build a message:

```typescript
messageTo(recipient)
  .text('Answer the question: Where is Berlin?')
  .quickTextReply('Germany', 'GER')
  .quickLocationReply();
```

Also see [examples](examples).

## LICENCE

[MIT](LICENCE)