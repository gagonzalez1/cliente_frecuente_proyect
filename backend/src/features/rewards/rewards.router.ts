import { Router, Request, Response } from 'express';
import { prisma } from '@/shared/database/prisma';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();

// Store for SSE connections (Barista terminals)
let baristaClients: Response[] = [];

/**
 * SSE Endpoint for Baristas: Escucha en tiempo real nuevos canjes.
 */
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  baristaClients.push(res);

  req.on('close', () => {
    baristaClients = baristaClients.filter(c => c !== res);
  });
});

function notifyBaristas(event: any) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  baristaClients.forEach(c => c.write(data));
}

/**
 * Initiate Reward: El cliente genera el canje.
 */
router.post('/initiate', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { words } = req.body;

  const reward = await prisma.activeReward.create({
    data: { userId, words, status: 'PENDING' },
    include: { user: { select: { alias: true } } }
  });

  notifyBaristas({ type: 'REWARD_INITIATED', reward });

  res.json({ success: true, reward });
});

/**
 * Burn Reward: El barista valida la entrega.
 */
router.post('/burn', async (req: Request, res: Response) => {
  const { rewardId } = req.body;

  const reward = await prisma.activeReward.update({
    where: { id: rewardId },
    data: { status: 'BURNED' },
    include: { user: { include: { progress: true } } }
  });

  // Resetear sellos y sumar premio ganado
  if (reward.user.progress) {
    await prisma.userProgress.update({
      where: { userId: reward.userId },
      data: {
        currentStamps: 0,
        totalRewardsEarned: { increment: 1 }
      }
    });
  }

  notifyBaristas({ type: 'REWARD_BURNED', rewardId });

  res.json({ success: true });
});

export default router;
