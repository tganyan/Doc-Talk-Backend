'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const HttpError = require('http-errors');

const searchToken = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expTime: {
    type: String,
    required: true,
    unique: true,
  },
},
{
  usePushEach: true,
});

const SearchToken = module.exports = mongoose.model('searchToken', searchToken);

SearchToken.save = (token, expTimeOffset) => {
  const expTime = Math.floor(new Date().getTime() / 1000) + expTimeOffset;
  return new SearchToken({
    token,
    expTime,
  }).save();
};
