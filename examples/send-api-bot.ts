import http = require('http');
import platform = require('../index');
import { sendMessage, messageTo, webhookApi } from '../index';

const PAGE_TOKEN = 'TOKEN';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

http
  .createServer(
    platform
      .createServer({
        verificationToken: 'test',
      })
      .onTextMessage(async (testMessage: webhookApi.MessageReceivedEvent) => {
        await delay(1000);
        console.log('sending mark_seen');
        await sendMessage(
          PAGE_TOKEN,
          messageTo(testMessage.sender).action('mark_seen'),
        );
        await delay(1000);
        console.log('sending text msg');
        await sendMessage(
          PAGE_TOKEN,
          messageTo(testMessage.sender).text('This is a simple text message'),
        );
        await delay(1000);
        console.log('sending typing_on');
        await sendMessage(
          PAGE_TOKEN,
          messageTo(testMessage.sender).action('typing_on'),
        );
        await delay(2000);
        console.log('sending typing_off');
        await sendMessage(
          PAGE_TOKEN,
          messageTo(testMessage.sender).action('typing_off'),
        );
        await sendMessage(
          PAGE_TOKEN,
          messageTo(testMessage.sender).image(
            'https://just-comments.com/widget/no-pic.png',
          ),
        );

        await delay(1000);
        await sendMessage(
          PAGE_TOKEN,
          messageTo(testMessage.sender)
            .text('Answer the question: In which country is Stuttgart located?')
            .quickTextReply('Germany', 'GER')
            .quickLocationReply(),
        );
      })
      .done(),
  )
  .listen(3000);
