'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const CryptoJS = require('crypto-js');

const router = module.exports = new express.Router();
const SearchTokenModel = require('../models/search-token');

const CLIENT_URL = 'http://localhost:8080';
const MEDIC_API_LOGIN = process.env.MEDIC_API_LOGIN;  // eslint-disable-line
const MEDIC_API_KEY = process.env.MEDIC_API_KEY; // eslint-disable-line
const API_URL = 'http://localhost:4000/oauth/google'; // eslint-disable-line
const MEDIC_API_SECRET = process.env.MEDIC_API_SECRET; // eslint-disable-line

const computedHash = CryptoJS.HmacMD5(MEDIC_API_LOGIN, MEDIC_API_SECRET);
const computedHashString = computedHash.toString(CryptoJS.enc.Base64);

router.get('/oauth/medic_api/tokenRefresh', (request, response) => {
  return superagent.post(MEDIC_API_LOGIN)
    .set('Authorization', `Bearer ${MEDIC_API_KEY}:${computedHashString}`)
    .then((tokenResponse) => {
      console.log(tokenResponse.body);
      if (!tokenResponse.body.access_token) {
        response.redirect(CLIENT_URL);
      }
      const searchToken = tokenResponse.body.Token;
      const searchTokenExp = tokenResponse.body.ValidThrough;
      return SearchTokenModel.save(searchToken, searchTokenExp)
        .catch((error) => {
          console.error(error);
          response.redirect(CLIENT_URL);
        });
    });
});

router.get('/oauth/medic_api/token', (request, response) => {
  return SearchTokenModel.get()
    .then((receivedToken) => {
      response.status(200)
        .send(receivedToken);
    })
    .catch((error) => {
      console.error(error);
      response.redirect(CLIENT_URL);
    });
});
