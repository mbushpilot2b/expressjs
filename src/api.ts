import express from 'express';
import cors from 'cors';
const axios = require('axios');

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

api.post('/data', async (req, res) => {
  const bodyToPassBack = await passToApi(req.body);
  res.status(200).send(bodyToPassBack);
});


// Version the api
app.use('/api/v1', api);

const passToApi = async (body: any) => {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4000/graphql',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(body)
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  }
  catch (error) {
    console.log(error);
  }
}