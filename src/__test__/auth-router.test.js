'use strict';

const faker = require('faker');
const superagent = require('superagent');
const mockAccount = require('./lib/auth-account-mock');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;

describe('auth-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(mockAccount.pCleanAuthAccountMocks);

  test('Testing if a 404 is sent if any requested route is invalid', () => {
    return superagent.get(`${API_URL}/fake/route`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('Testing if a 200 is sent with a token on successful signup attempt', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        username: faker.lorem.words(2),
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('Testing if a 500 is sent if body data is missing.', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(500);
      });
  });
  test('Testing if a 401 is sent if body is missing', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(401);
      });
  });
  // test('Testing if a 200 and a token is sent on successful login', () => {
  //   return mockAccount.pCreateMock()
  //     .then((mock) => {
  //       return superagent.get(`${API_URL}/api/login`)
  //         .auth(mock.request.username, mock.request.password);
  //     })
  //     .then((response) => {
  //       expect(response.status).toEqual(200);
  //       expect(response.body.token).toBeTruthy();
  //     });
  // });
  test('Testing if a 400 is sent if login fails (incorrect or no password or username)', () => {
    return mockAccount.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(mock.request.username, 'bad-password');
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
