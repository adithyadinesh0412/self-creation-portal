const express = require('express')
const cors = require('cors')
const session = require('express-session');
const { getKeycloak, memoryStore} = require('./keycloak-config');
const axios = require('axios')


const app = express();

const corsOpts = {
    origin: '*',

    methods: [
      'GET',
      'POST',
    ],

    allowedHeaders: [
      'Content-Type',
    ],
  };

  app.use(cors(corsOpts));

let keycloak = getKeycloak()


app.use(session({
  secret: 'cbff7f9cd36dd011dde11b5e3533fd28372b3af4df57308b3b4fe0fa8a5c9690', // random hashed number not a real secret key.
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.all([
  '/projects/*','/form/*','/resource/*','/review/*','/comment/*','/certificate/*','/role-permission-mapping'
], keycloak.middleware({ admin: '/callback', logout: '/logout' }));


var postData = {
  client_id:"self-creation-portal",
  client_secret:"TiTcodBOfJ79XRnQUHRsrOnh4PTqZhgh",
  grant_type:"password",
  username:"ramkumar",
  password:'Pace@1234'
};

postData = new URLSearchParams(postData).toString();

app.get('/login', (req, res) => {
  axios.post('http://localhost:8080/realms/master/protocol/openid-connect/token', postData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    req.session.token = response.data.access_token;
    console.log(req.session);
    res.redirect("http://localhost:8080/realms/master/protocol/openid-connect/auth?client_id=security-admin-console&redirect_uri=http%3A%2F%2Flocalhost%3A4200/%2Fadmin%2Fmaster%2Fconsole%2F%23%2Fmaster%2Fclients%2Fa3a86113-d82c-4523-aea5-b80369f0a83d%2Fsettings&state=6e0fc51a-fd3b-4614-bbcf-8b6068c0f7b5&response_mode=fragment&response_type=code&scope=openid&nonce=99fe0d9a-edf6-4baa-8634-1009c94bd5eb&code_challenge=FerMFVqOjn9KSYF_5QooPWGDN6bkqwVGuR7xOCFwweU&code_challenge_method=S256")
    // res.send(response.data);
  })
  .catch(error => console.error('Error:', error));
});

app.listen(3000)
