import { Router, Request, Response } from 'express';
import { prisma } from '@/shared/database/prisma';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

const router = Router();

/**
 * Claim Stamp: Valida código, GPS y cooldown antes de sumar un sello.
 */
router.post('/claim', authMiddleware, async (req: Request, res: Response) => {
  const { code, latitude, longitude, branchId } = req.body;
  const userId = (req as any).user.id;

  if (!code || !branchId) {
    return res.status(400).json({ error: 'Missing code or branchId' });
  }

  // 1. Validar Token Dinámico
  const token = await prisma.dynamicToken.findFirst({
    where: {
      code: code.toUpperCase(),
      branchId,
      expiresAt: { gt: new Date() }
    }
  });

  if (!token) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  // 2. Validar GPS
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) return res.status(404).json({ error: 'Branch not found' });

  const distance = haversineMeters(latitude, longitude, branch.latitude, branch.longitude);
  if (distance > branch.allowedRadiusMeters) {
    return res.status(403).json({ error: 'You are too far from the shop' });
  }

  // 3. Validar Cooldown
  const progress = await prisma.userProgress.findUnique({ where: { userId } });
  if (progress?.lastStampAt) {
    const hoursDiff = (Date.now() - progress.lastStampAt.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 5) {
      return res.status(429).json({ error: 'Cooldown active. Please wait 5 hours.' });
    }
  }

  // 4. Sumar Sello
  const updatedProgress = await prisma.userProgress.update({
    where: { userId },
    data: {
      currentStamps: { increment: 1 },
      lastStampAt: new Date()
    }
  });

  res.json({ success: true, progress: updatedProgress });
});

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default router;
