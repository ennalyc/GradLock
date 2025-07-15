import express from 'express';
import userController from '../controllers/user-controllers';
import { validateRequest } from '../middlewares/validation-middlewares';
import { createUserSchema } from '../validators/user-validators';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registra usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - name
 *               - type
 *               - password
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: 12345678901
 *               name:
 *                 type: string
 *                 example: Dennis Ritchie
 *               enrollment:
 *                 type: string
 *                 example: 98765432109
 *               course:
 *                 type: string
 *                 example: Ciência da Computação
 *               userType:
 *                 type: string
 *                 example: student
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
 *                  id:
 *                    type: integer
 *                    example: 1
 *                  cpf:
 *                    type: string
 *                    example: 12345678901
 *                  name:
 *                    type: string
 *                    example: Dennis Ritchie
 *                  enrollment:
 *                    type: string
 *                    example: 98765432109
 *                  course:
 *                    type: string
 *                    example: Ciência da Computação
 *                  usesrType:
 *                    type: string
 *                    example: student
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                    example: '2025-01-01T00:00:00Z'
 *                  updatedAt:
 *                    type: string
 *                    format: date-time
 *                    example: '2025-01-01T00:00:00Z'
 */
router.post('', validateRequest({ bodySchema: createUserSchema }), userController.createUser);

export default router;
