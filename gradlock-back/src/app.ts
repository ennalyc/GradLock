import express, { ErrorRequestHandler } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './config/swaggerConfig';

import { AppError, InternalServerError } from './errors/httpErrors';
import apiRouter from './routes/api';

const app = express();

app.use(express.json());

const swaggerDocs = swaggerJSDoc(swaggerConfig);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiRouter);

// Middleware de tratamento de erros com tipagem do Express
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(`error:\n${error.stack}`);

  let errorToClient = error;
  if (!(error instanceof AppError)) {
    errorToClient = new InternalServerError();
  }

  res.status(errorToClient.statusCode).json({
    status: errorToClient.status,
    message: errorToClient.message,
  });
};

app.use(errorHandler);

export default app;
