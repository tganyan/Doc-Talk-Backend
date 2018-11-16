'use strict';

const faker = require('faker');
const Account = require('../../models/account');


const accountMock = {};

accountMock.pCreateMock = () => {
  const mock = {};
  mock.request = {
    username: faker.lorem.words(2),
    password: faker.lorem.words(1),
    email: faker.internet.email(),
  };

  return Account.create(
    mock.request.username,
    mock.request.email,
    mock.request.password,
  )
    .then((createdAccount) => {
      mock.account = createdAccount;
      return createdAccount.pCreateToken();
    })
    .then((token) => {
      mock.token = token;
      return mock;
    })
    .catch((error) => {
      console.error(error);
    });
};

accountMock.pCleanAuthAccountMocks = () => Account.remove({});
module.exports = accountMock;
