'use strict';

process.env.PORT = 4000;
process.env.MONGODB_URI = 'mongodb://localhost/testdb';
process.env.APP_SECRET = 'CRd25f3JJn7eU27aE57Y7ub6hatF3FKvVSa8t42835j8S67CNTyG4vF24aiSbMkLZ6jVWt';

// added these via heroku on this branch specifically
process.env.AWS_ACCESS_KEY_ID = 'SECRET ID';
process.env.AWS_SECRET_ACCESS_KEY = 'SECRET INFORMATION';
process.env.AWS_BUCKET = 'test-bucket';
