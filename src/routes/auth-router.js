'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const router = module.exports = new express.Router();

const CLIENT_URL = 'http://localhost:8080';
const GOOGLE_BACKEND = 'https://www.googleapis.com/oauth2/v4/token';
const API_URL = 'http://localhost:4000/oauth/google';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';


//////////////////////// GOOGLE OAUTH ///////////////////////////////
router.get('/oauth/google', (request, response) => {
  if (!request.query.code) {
    response.redirect(CLIENT_URL);
  } else {
    return superagent.post(GOOGLE_BACKEND)
        .type('form')
        .send({
          code: request.query.code,
          grant_type: 'authorization_code',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: API_URL
        })
        .then(tokenResponse => {
          if (!tokenResponse.body.access_token) {
            response.redirect(CLIENT_URL);
          }

          const googleToken = tokenResponse.body.access_token;

          return superagent.get(OPEN_ID_URL)
              .set('Authorization', `Bearer ${googleToken}`);
        })
        .then(openIdResponse => {
          console.log(openIdResponse.body);


          response.cookie('DOCTALK-OAUTH-TOKEN', 'You have been prescribed this token');
          response.redirect(CLIENT_URL);
        })
        .catch(error => {
          console.error(error);
          response.redirect(CLIENT_URL);
        });
  }
});
