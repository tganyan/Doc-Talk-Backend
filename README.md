# Doc-Talk Backend

## Overview

### Current version

1.1.1

### Description
- Doc-Talk is an app that's been created to allow users to possibly self-diagnosis their own condition. Our site is easy to use, we do require
you to make an account. Once logged in, fill out our simple form which includes your possible symptoms, age and gender.
Once submitted, your possible conditions will populate on our site.
- We are using [**ApiMedic**](https://apimedic.com/) which is a 'medical symptom checker' specifically for patients.


### Disclaimer
_If you are suffering from anything that seems major PLEASE go to the hospital/ER. Receiving a proper medical diagnosis
can only be done by a medical professional. Our site should only be used to help you get a possible general idea of what you may have._

## Token Logic

A token received from the API will expire after two hours, so when clicking the submit button for the diagnosis form we must check the token stored in our database to see if it has expired. We send a GET request to the /oauth/medic_api/token route, and receive our stored token object, such as this.
```
info: Processing a GET request on /oauth/medic_api/token
{ _id: 5beccf47bf75513b1c4bc3fe,
 token:
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imphc29uaGlAY3JhenlyZWRoZWFkLmNvbSIsInJvbGUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiNDIyMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGltaXQiOiI5OTk5OTk5OTkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXAiOiJQcmVtaXVtIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAxOC0xMS0xMSIsImlzcyI6Imh0dHBzOi8vc2FuZGJveC1hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNTQyMzEyNzM5LCJuYmYiOjE1NDIzMDU1Mzl9.vNTuEHlmfJ_K_qE6ms7lQmT1jZSr8x2IDsTR9kBzDrw',
 expTime: '1542312730' }
```
The expTime property on our token object is the expiration time in Unix time, we compare this to the current unix time. If the expTime is less than the current unix time we need to get a new token, so we send a GET request to the /oauth/medic_api/tokenRefresh route, in order to receive a new token object, such as this.
```
info: Processing a GET request on /oauth/medic_api/tokenRefresh
{ Token:
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imphc29uaGlAY3JhenlyZWRoZWFkLmNvbSIsInJvbGUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiNDIyMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGltaXQiOiI5OTk5OTk5OTkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXAiOiJQcmVtaXVtIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAxOC0xMS0xMSIsImlzcyI6Imh0dHBzOi8vc2FuZGJveC1hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNTQyMzEyNzM5LCJuYmYiOjE1NDIzMDU1Mzl9.vNTuEHlmfJ_K_qE6ms7lQmT1jZSr8x2IDsTR9kBzDrw',
 ValidThrough: 7200 }
```
The ValidThrough property on our token object the the number of seconds until the token expires, we must multiply the value by 1000 to convert it to milliseconds, used in unix time, and add the result to the current unix time, creating our new expTime property and adding it onto the object. We then update the database with our new token. Once we have an unexpired token, the front-end will be able to make a request to get our actual diagnosis.

## Testing

### Testing Framework: jest

#### auth-router.js

-Testing if a 404 is sent if any requested route is invalid

-Testing if a 200 is sent with a token on successful signup attempt

-Testing if a 200 and a token is sent on successful login

-Testing if a 500 is sent if body data is missing

-Testing if a 401 is sent if body is missing

-Testing if a 400 is sent if login fails (incorrect or no password)

-Testing if a 400 is sent if login fails (incorrect or no username)

#### search-token-router.js

-testing that when token refresh is called a new token is returned - should return isValid = true

-testing that when token is called the existing token is returned - should return isValid = true

## Built With

Please see package.json to confirm dependency details

## Contributing

Please feel free to contribute. Master branch auto merge locked for approval for non-contributors.

## Local Machine

* Clone repo, run -npm install
* Clone back-end repo (https://github.com/tganyan/Doc-Talk-Backend), run -npm install
* On back-end, run database, -npm run dbOn
* On back-end, run server, -npm run start
* On front-end, open localhost, - npm run watch

## Planned Enhancements

In upcoming releases we plan to:

* Create a chat-room with socket-io, these chat-rooms will allow you to speak privately to a live doctor on the spot.
* We also will be creating a common chat-room that clients can join. Ask questions, make suggestions etc.
* We also will be allowing users to save/favorite articles.

## Authors

![CF](http://i.imgur.com/7v5ASc8.png) [**Brai Frauen**](https://github.com/ashabrai), [**Jason Hiskey**](https://github.com/jlhiskey), [**Kristian Esvelt**](https://github.com/kris3579), [**Tyler Anyan**](https://github.com/tganyan)

## License

MIT

