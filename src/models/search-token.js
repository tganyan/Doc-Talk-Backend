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
  const expTimeData = Math.floor(new Date().getTime() / 1000) + expTimeOffset;
  const tokenData = token;
  return SearchToken.findByIdAndUpdate('5bec6e69687fce1d188f3baa', { token: tokenData, expTime: expTimeData });
};

SearchToken.get = () => {
  SearchToken.findOne({ _id: '5bec6e69687fce1d188f3baa' })
    .then((token) => {
      console.log('this is the log from search-token', token);
      return token;
    })
    .then((returnedToken) => {
      return returnedToken;
    })
    .catch((error) => {
      console.log(error);
    });
};
