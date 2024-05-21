require('dotenv').config();
const express = require('express')
const cors = require('cors')
const session = require('express-session');
const { getKeycloak, memoryStore} = require('./keycloak-config');
const axios = require('axios')




const app = express();
const baseUrl = process.env.BASE_URL;
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


// app.all([
//   '/projects/*','/form/*','/resource/*','/review/*','/comment/*','/certificate/*','/role-permission-mapping'
// ]);

// to read the URL encoded form data
app.use(express.urlencoded({ extended: true }));


// app.post('/user/*', (req, res) => {
//   console.log(req.body);
//   axios.post(baseUrl+req.originalUrl, req.body)
//   .then(response => {
//     console.log(response)
//     res.send(response.data);
//   })
//   .catch(error => {
//     console.log(error)
//     res.statusCode = 400
//     res.statusMessage = "wrong Input"
//     res.send(error.data);
//   });
// });

app.all('*', async (req, res) => {
  try {
      // Extract the original URL
      const originalUrl = req.originalUrl;

      // Modify the base URL as needed
      const newUrl = `${baseUrl}${originalUrl}`;

      // Prepare the options for the axios request
      const options = {
          method: req.method,
          url: newUrl,
          headers: {
              ...req.headers,
              host: new URL(baseUrl).host
          },
          data: req.body
      };
      console.log(newUrl,originalUrl,options)
      // Make the API call
      const response = await axios(options);

      // Send the response back to the client
      res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error)
      if (error.response) {
          // The request was made and the server responded with a status code
          res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
          // The request was made but no response was received
          res.status(500).json({ error: 'No response received from the server.' });
      } else {
          // Something happened in setting up the request
          res.status(500).json({ error: error.message });
      }
  }
});

app.listen(3000)
