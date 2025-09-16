// main-lambda.js
// Lambda entrypoint for NestJS using aws-serverless-express
const awsServerlessExpress = require('aws-serverless-express');
const { createApp } = require('./dist/main-lambda-bootstrap');

let server;
exports.handler = async (event, context) => {
  if (!server) {
    const app = await createApp();
    server = awsServerlessExpress.createServer(app.getHttpAdapter().getInstance());
  }
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
