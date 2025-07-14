const PORT = process.env.PORT || 3000;

export const serverConfig = {
  port: PORT,
  base_path: process.env.BASE_PATH || `http://localhost:${PORT}`,
};
