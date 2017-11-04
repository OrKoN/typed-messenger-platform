import { messageTo } from '../lib/builder';
import * as chai from 'chai';

const expect = chai.expect;

describe('builder', () => {
  describe('text', () => {
    it('should build messages with text', () => {
      expect(
        messageTo({
          id: 'test',
        }).text('Some message'),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: { text: 'Some message' },
      });
    });
  });

  describe('action', () => {
    it('should build messages with a sender action', () => {
      expect(
        messageTo({
          id: 'test',
        }).action('typing_on'),
      ).to.deep.equal({
        recipient: { id: 'test' },
        sender_action: 'typing_on',
      });
    });
  });

  describe('image', () => {
    it('should build messages with an image attachment', () => {
      expect(
        messageTo({
          id: 'test',
        }).image('url', true),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          attachment: {
            type: 'image',
            payload: { url: 'url', is_reusable: true },
          },
        },
      });
    });
  });

  describe('file', () => {
    it('should build messages with an file attachment', () => {
      expect(
        messageTo({
          id: 'test',
        }).file('url', true),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          attachment: {
            type: 'file',
            payload: { url: 'url', is_reusable: true },
          },
        },
      });
    });
  });

  describe('audio', () => {
    it('should build messages with an audio attachment', () => {
      expect(
        messageTo({
          id: 'test',
        }).audio('url', true),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          attachment: {
            type: 'audio',
            payload: { url: 'url', is_reusable: true },
          },
        },
      });
    });
  });

  describe('video', () => {
    it('should build messages with an video attachment', () => {
      expect(
        messageTo({
          id: 'test',
        }).video('url', true),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          attachment: {
            type: 'video',
            payload: { url: 'url', is_reusable: true },
          },
        },
      });
    });
  });

  describe('buttons', () => {
    it('should build messages with an button template attachment', () => {
      expect(
        messageTo({
          id: 'test',
        }).buttons('Question?', [
          {
            type: 'web_url',
            title: 'Answer 1',
            url: 'url to answer',
          },
          {
            type: 'postback',
            title: 'Answer 2',
            payload: 'answer2',
          },
          {
            type: 'phone_number',
            title: 'Call us',
            payload: '+49555555555',
          },
        ]),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'Question?',
              buttons: [
                {
                  type: 'web_url',
                  title: 'Answer 1',
                  url: 'url to answer',
                },
                {
                  type: 'postback',
                  title: 'Answer 2',
                  payload: 'answer2',
                },
                {
                  type: 'phone_number',
                  title: 'Call us',
                  payload: '+49555555555',
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('generic', () => {
    it('should build messages with an generic template attachment', () => {
      expect(
        messageTo({
          id: 'test',
        }).genericTemplate([
          {
            title: 'Test',
            buttons: [
              {
                type: 'web_url',
                url: 'url',
                title: 'open',
              },
            ],
          },
        ]),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              image_aspect_ratio: 'horizontal',
              sharable: false,
              elements: [
                {
                  title: 'Test',
                  buttons: [
                    {
                      type: 'web_url',
                      url: 'url',
                      title: 'open',
                    },
                  ],
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('quickTextReply', () => {
    it('should build messages with a quick text reply', () => {
      expect(
        messageTo({
          id: 'test',
        }).quickTextReply('text', 'payload', 'icon url'),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          quick_replies: [
            {
              content_type: 'text',
              title: 'text',
              image_url: 'icon url',
              payload: 'payload',
            },
          ],
        },
      });
    });
  });

  describe('quickLocationReply', () => {
    it('should build messages with a quick text reply', () => {
      expect(
        messageTo({
          id: 'test',
        }).quickLocationReply(),
      ).to.deep.equal({
        recipient: { id: 'test' },
        message: {
          quick_replies: [
            {
              content_type: 'location',
            },
          ],
        },
      });
    });
  });
});
