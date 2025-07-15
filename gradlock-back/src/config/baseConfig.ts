function parseEnvInt(envValue: string | undefined, fallback: number): number {
  const parsed = Number(envValue);
  return isNaN(parsed) ? fallback : parsed;
}

const PORT = parseEnvInt(process.env.PORT, 3000);

export const serverConfig = {
  port: PORT,
  basePath: process.env.BASE_PATH || `http://localhost:${PORT}`,
};

export const securityConfig = {
  saltRounds: parseEnvInt(process.env.SALT_ROUNDS, 10),
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
};
