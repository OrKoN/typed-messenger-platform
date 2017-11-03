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
