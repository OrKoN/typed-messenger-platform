// import * as sendApi from '../lib/types/send-api';
import { messageTo } from '../lib/builder';
// import * as chai from 'chai';

// const expect = chai.expect;

describe('builder', () => {
  describe('text', () => {
    it('should build messages with text', () => {
      console.log(
        messageTo({
          id: 'test',
        }).text('Some message'),
      );
    });
  });

  describe('action', () => {
    it('should build messages with a sender action', () => {
      console.log(
        messageTo({
          id: 'test',
        }).action('typing_on'),
      );
    });
  });

  describe('image', () => {
    it('should build messages with an image attachment', () => {
      console.log(
        messageTo({
          id: 'test',
        }).image('url', true),
      );
    });
  });

  describe('quickTextReply', () => {
    it('should build messages with a quick text reply', () => {
      console.log(
        messageTo({
          id: 'test',
        }).quickTextReply('text'),
      );
    });
  });
});
