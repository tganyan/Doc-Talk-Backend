'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

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
  const expTimeData = Math.floor(new Date().getTime() / 1000) + expTimeOffset - 10;
  const tokenData = token;
  return SearchToken.findByIdAndUpdate('5bedb08fd7922b41e009792a', { token: tokenData, expTime: expTimeData });
};

SearchToken.get = () => {
  return SearchToken.findOne({ _id: '5bedb08fd7922b41e009792a' })
    .then((token) => {
      console.log(token);
      return token;
    })
    .catch((error) => {
      console.log(error);
    });
};
