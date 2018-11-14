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
  return SearchToken.findByIdAndUpdate('5bea51088c2d470a50eb2730', { token: tokenData, expTime: expTimeData });
};

SearchToken.get = () => {
  SearchToken.findOne({ _id: '5bea51088c2d470a50eb2730' })
    .then((token) => {
      console.log(token);
    })
    .catch((error) => {
      console.log(error);
    });
};
