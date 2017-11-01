import http = require('http');
import * as platform from '../index';

const PAGE_TOKEN = 'TOKEN';

const { sendMessage, messageTo } = platform;

const fbServer = platform
  .createServer({
    // initial configuration
    verificationToken: 'test',
  })
  // handle messages
  .onTextMessage(
    async (testMessage: platform.webhookApi.MessageReceivedEvent) => {
      await sendMessage(
        PAGE_TOKEN,
        messageTo(testMessage.sender).text(
          testMessage.message.text || 'No message',
        ),
      );
    },
  );

http.createServer(fbServer.done()).listen(3000);

fbServer.on('error', (err: Error) => {
  console.log('error', err);
});
