import * as webhookApi from '../lib/types/webhook-api';
import { Server } from '../lib/server';
import * as chai from 'chai';

const expect = chai.expect;

describe('server', () => {
  const server = new Server({
    verificationToken: 'bogus',
  });

  it('should handle text messages', () => {
    const textMessage: webhookApi.MessageReceivedEvent = {
      sender: {
        id: '1651165678248027',
      },
      recipient: {
        id: '105799670189847',
      },
      timestamp: 1509359757070,
      message: {
        mid: 'mid.$cAAA6yg8r1FVlnh9vDlfbNomxd-tL',
        seq: 79991,
        text: 'hi',
      },
    };

    const event: webhookApi.WebhookEvent = {
      object: 'page',
      entry: [
        {
          id: '105799670189847',
          time: 1509359758377,
          messaging: [textMessage],
        },
      ],
    };

    return server._handleEvent(event, {
      onLocationMessage: [],
      onTextMessage: [
        async (data: webhookApi.MessageReceivedEvent) => {
          expect(data.sender).to.deep.equal({
            id: '1651165678248027',
          });
          expect(data.recipient).to.deep.equal({
            id: '105799670189847',
          });
          expect(data.message).to.deep.equal({
            mid: 'mid.$cAAA6yg8r1FVlnh9vDlfbNomxd-tL',
            seq: 79991,
            text: 'hi',
          });
          return Promise.resolve();
        },
      ],
    });
  });

  it('should handle location messages', () => {
    const locationMessage: webhookApi.MessageReceivedEvent = {
      sender: {
        id: '1651165678248027',
      },
      recipient: {
        id: '105799670189847',
      },
      timestamp: 1509359757070,
      message: {
        mid: 'mid.$cAAA6yg8r1FVlnh9vDlfbNomxd-tL',
        seq: 79991,
        attachments: [
          {
            title: "Alex's Location",
            url: 'url',
            type: 'location',
            payload: {
              coordinates: {
                lat: 48.7866044,
                long: 9.215135,
              },
            },
          },
        ],
      },
    };

    const event: webhookApi.WebhookEvent = {
      object: 'page',
      entry: [
        {
          id: '105799670189847',
          time: 1509359758377,
          messaging: [locationMessage],
        },
      ],
    };

    return server._handleEvent(event, {
      onLocationMessage: [
        async (data: webhookApi.MessageReceivedEvent) => {
          expect(data.sender).to.deep.equal({
            id: '1651165678248027',
          });
          expect(data.recipient).to.deep.equal({
            id: '105799670189847',
          });
          expect(data.message.attachments).to.deep.equal([
            {
              title: "Alex's Location",
              url: 'url',
              type: 'location',
              payload: {
                coordinates: {
                  lat: 48.7866044,
                  long: 9.215135,
                },
              },
            },
          ]);
          return Promise.resolve();
        },
      ],
      onTextMessage: [],
    });
  });
});
