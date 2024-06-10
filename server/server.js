require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
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
  app.use(bodyParser.json());

app.all('*', async function (req, res) {
  try {
      // Extract the original URL
      const originalUrl = req.originalUrl;

      // Modify the base URL as needed
      const newUrl = `${baseUrl}${originalUrl}`;
      options = {
        method: req.method,
        url: newUrl,
        headers: {
          'X-auth-token': req.headers['x-auth-token']
        }
      }
      if(Object.keys(req.body).length>0) {
        options.data = req.body
      }
      console.log(req.body);
      const response = await axios(options);
    // Send the response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error);
      if (error.response) {
          // The request was made and the server responded with a status code
          res.status(error.response.status).json(error.response.config.data);
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