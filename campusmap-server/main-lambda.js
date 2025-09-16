
// main-lambda.js
// Lambda entrypoint for NestJS using @vendia/serverless-express
const serverlessExpress = require('@vendia/serverless-express');
const { createApp } = require('./dist/main-lambda-bootstrap');

let cachedServer;
exports.handler = async (event, context) => {
  if (!cachedServer) {
    console.log('[Lambda] Creando app NestJS para serverless-express...');
    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
    console.log('[Lambda] App NestJS lista para serverless-express.');
  }
  console.log('[Lambda] Evento recibido:', JSON.stringify(event));
  return cachedServer(event, context);
};
