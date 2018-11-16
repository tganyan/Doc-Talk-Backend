'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const logger = require('../lib/logger');
const basicAccountMiddleware = require('../lib/middleware/basic-auth-middleware');

const Account = require('../models/account');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// const CLIENT_URL = 'http://localhost:8080';
// const GOOGLE_BACKEND = 'https://www.googleapis.com/oauth2/v4/token';
// const API_URL = 'http://localhost:4000/oauth/google';
// const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

// ============================================================================
// ACCOUNT SIGN-UP
// ============================================================================
router.post('/api/signup', jsonParser, (request, response, next) => {
  console.log('REQUEST BODY', request.body);
  if (!request.body.password) {
    return next(new HttpError(401, ''));
  }

  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((createdAccount) => {
      delete request.body.password;
      return createdAccount.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'Responding with a 200 status code and a token');
      return response.json(
        {
          token,
        },
      );
    })
    .catch(error => next(error));
});

// ===============================+=============================================
// ACCOUNT LOG-IN
// ============================================================================
router.get('/api/login', basicAccountMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  return request.account.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'responding with 200 status code and a token');
      return response.json({ token });
    })
    .catch(error => next(error));
});
