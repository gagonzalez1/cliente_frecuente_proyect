import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/shared/database/prisma';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * MOCK LOGIN: En un entorno real, aquí se validaría el ID Token de Google.
 * Para el MVP, recibimos el email y el nombre, y devolvemos un JWT.
 */
router.post('/google', async (req, res) => {
  const { email, alias, avatar } = req.body;

  if (!email || !alias) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let user = await prisma.user.findUnique({
    where: { email },
    include: { progress: true }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        alias,
        avatar,
        progress: {
          create: {
            currentStamps: 3, // Empezamos con 3 para la demo
            totalRewardsEarned: 2,
          }
        }
      },
      include: { progress: true }
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user });
});

export default router;
