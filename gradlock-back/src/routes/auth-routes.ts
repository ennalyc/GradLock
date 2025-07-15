import express from 'express';
import { authController } from '../controllers/auth-controllers';
import { validateRequest } from '../middlewares/validation-middlewares';
import { authCredentialsSchema, refreshTokenSchema } from '../validators/auth-validators';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - password
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: 12345678901
 *               password:
 *                 type: string
 *                 example: "segredo123"
 *     responses:
 *       201:
 *         description: Dados do usuário criado
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  accessToken:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjczYWEyZS1kMTgxLTRkNTYtYWE2OS0yYjE2N2E1YmZmMzUiLCJ1c2VyVHlwZSI6ImNsaWVudGUiLCJpYXQiOjE2ODg4NjM2MDAsImV4cCI6MTY4ODg2NDgwMH0.1a2b3c4d5e6f7g8h9i0jKLmnopQRSTUVwxYz
 *                  refreshToken:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjczYWEyZS1kMTgxLTRkNTYtYWE2OS0yYjE2N2E1YmZmMzUiLCJ1c2VyVHlwZSI6ImNsaWVudGUiLCJpYXQiOjE2ODg4NjM2MDAsImV4cCI6MTY4ODg2NDgwMH0.1a2b3c4d5e6f7g8h9i0jKLmnopQRSTUVwxYz
 */
router.post('/login', validateRequest({ bodySchema: authCredentialsSchema }), authController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh do token de acesso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjczYWEyZS1kMTgxLTRkNTYtYWE2OS0yYjE2N2E1YmZmMzUiLCJ1c2VyVHlwZSI6ImNsaWVudGUiLCJpYXQiOjE2ODg4NjM2MDAsImV4cCI6MTY4ODg2NDgwMH0.1a2b3c4d5e6f7g8h9i0jKLmnopQRSTUVwxYz
 *     responses:
 *       201:
 *         description: Dados do usuário criado
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  accessToken:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjczYWEyZS1kMTgxLTRkNTYtYWE2OS0yYjE2N2E1YmZmMzUiLCJ1c2VyVHlwZSI6ImNsaWVudGUiLCJpYXQiOjE2ODg4NjM2MDAsImV4cCI6MTY4ODg2NDgwMH0.1a2b3c4d5e6f7g8h9i0jKLmnopQRSTUVwxYz
 *                  refreshToken:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjczYWEyZS1kMTgxLTRkNTYtYWE2OS0yYjE2N2E1YmZmMzUiLCJ1c2VyVHlwZSI6ImNsaWVudGUiLCJpYXQiOjE2ODg4NjM2MDAsImV4cCI6MTY4ODg2NDgwMH0.1a2b3c4d5e6f7g8h9i0jKLmnopQRSTUVwxYz
 */
router.post(
  '/refresh-token',
  validateRequest({ bodySchema: refreshTokenSchema }),
  authController.refreshToken,
);

export default router;
