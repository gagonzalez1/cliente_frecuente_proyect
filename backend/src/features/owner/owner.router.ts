import { Router } from 'express';
import { prisma } from '@/shared/database/prisma';

const router = Router();

/**
 * Get Stats for a Tenant
 */
router.get('/:tenantId/stats', async (req, res) => {
  const { tenantId } = req.params;

  const totalClients = await prisma.user.count({
    where: { role: 'CLIENT' }
  });

  const totalStampsToday = await prisma.userProgress.count({
    where: {
      lastStampAt: {
        gte: new Date(new Date().setHours(0,0,0,0))
      }
    }
  });

  const totalRewardsBurned = await prisma.activeReward.count({
    where: { status: 'BURNED' }
  });

  res.json({
    stats: {
      totalClients,
      totalStampsToday,
      totalRewardsBurned,
      retentionRate: '64%', // Mock for now
    }
  });
});

/**
 * Update Tenant Config
 */
router.patch('/:tenantId', async (req, res) => {
  const { tenantId } = req.params;
  const updates = req.body;

  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: updates
  });

  res.json(updatedTenant);
});

export default router;
