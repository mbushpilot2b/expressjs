import express from 'express';
import cors from 'cors';
import fetch, { Headers, RequestRedirect } from 'node-fetch';

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

api.post('/data', (req, res) => {
  const bodyToPassBack = passToApi(req.body);
  res.status(200).send(bodyToPassBack);
});


// Version the api
app.use('/api/v1', api);


const passToApi = (body) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify(body)

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow' as RequestRedirect
  };

  return fetch("https://gateway.foxtrax.io/graphql", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}