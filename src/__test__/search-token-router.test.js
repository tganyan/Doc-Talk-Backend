'use strict';

// development note: - see test.env.js for environment includes

const superagent = require('superagent');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;


describe('testing search-token-router', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('testing that when token refresh is called a new token is returned - should return isValid = true', () => {
    return superagent.get(`${API_URL}/oauth/medic_api/tokenRefresh`)
      .then((getResponse) => {
        expect(getResponse.status)
          .toEqual(200);
      });
  });
  test('testing that when token is called the existing token is returned - should return isValid = true', () => {
    return superagent.get(`${API_URL}/oauth/medic_api/token`)
      .then((getResponse) => {
        expect(getResponse.status)
          .toEqual(200);
      });
  });
});
