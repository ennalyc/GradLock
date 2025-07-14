import { serverConfig } from './config/baseConfig';
import app from './app';

app.listen(serverConfig.port, () => {
  console.log(`Servidor rodando em ${serverConfig.base_path}`);
});
