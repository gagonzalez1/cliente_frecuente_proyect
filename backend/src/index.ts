import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './shared/database/prisma';
import authRouter from '@/features/auth/auth.router';
import stampsRouter from '@/features/stamps/stamps.router';
import rewardsRouter from '@/features/rewards/rewards.router';
import ownerRouter from '@/features/owner/owner.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stamps', stampsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/owner', ownerRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Seed Initial Data (Only if empty)
app.get('/api/dev/seed', async (req, res) => {
  const tenantsCount = await prisma.tenant.count();
  if (tenantsCount === 0) {
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Black Clover',
        colorPrimary: '#0a0a0a',
        colorSecondary: '#c8a96e',
        totalStampsRequired: 5,
        branches: {
          create: {
            name: 'Villa Crespo',
            address: 'Serrano 1234, CABA',
            latitude: -34.5954,
            longitude: -58.4445,
          }
        }
      },
      include: { branches: true }
    });
    
    // Create initial token
    await prisma.dynamicToken.create({
      data: {
        code: 'AK4',
        branchId: tenant.branches[0].id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      }
    });

    return res.json({ message: 'Seeded successfully', tenant });
  }
  res.json({ message: 'Database already has data' });
});

app.listen(PORT, () => {
  console.log(`🚀 CoffeeLoyalty Backend running on http://localhost:${PORT}`);
});