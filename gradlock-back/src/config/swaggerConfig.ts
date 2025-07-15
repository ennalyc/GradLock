import path from 'path';
import { serverConfig } from './baseConfig';

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gradlock API',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [{ url: serverConfig.basePath }],
  },
  apis: [path.join(__dirname, '../routes/**/*.ts')],
};

export default swaggerConfig;
