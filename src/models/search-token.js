'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const HttpError = require('http-errors'); // eslint-disable-line

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
  return SearchToken.findByIdAndUpdate('5beccf47bf75513b1c4bc3fe', { token: tokenData, expTime: expTimeData });
};

SearchToken.get = () => {
  // SearchToken.findById('5beccf47bf75513b1c4bc3fe', (err, ad) => {
  //   return ad;
  // });
  // /*
  return SearchToken.findOne({ _id: '5beccf47bf75513b1c4bc3fe' })
    .then((token) => {
      console.log(token);
      return token;
    })
    .catch((error) => {
      console.log(error);
    });
};
