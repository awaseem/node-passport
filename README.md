# node-passport

Playing around with express, node, and passport js. Allows for authentication Twitter, Google Plus and Facebook.

After the authentication gone through you will be redirected to a profile page showing information about the logged in user.

# Setup

Start by installing all the packages in your `package.json` file:

`npm install`

After thats done, we need to setup our database in `config/database.js`:

replace the following with your own Mongo URI (mine is from mongoLabs, check them out:https://mongolab.com):

`"url": "mongodb://test:test@ds047438.mongolab.com:47438/node-auth"`

Next we need to get API access from all the social media platforms and replace all the keys inconfig/auth.js:

```
...
    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
...
```

To run your app just go: `node server.js` and navigate to http://localhost:8080
