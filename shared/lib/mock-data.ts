// Mock tenant data - simula lo que vendría del backend según tenant_id
export const MOCK_TENANT = {
  id: 'black-clover',
  name: 'Black Clover',
  logoText: 'BlackClover',
  colorPrimary: '#0f0f0f',
  colorSecondary: '#c8a96e',
  colorAccent: '#F3E5AB',
  totalStampsRequired: 5,
};

// Mock usuario logueado
export const MOCK_USER = {
  id: 'user-001',
  name: 'Gabo',
  email: 'gabo@email.com',
  avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Gabo',
  alias: 'Gabo',
};

// Mock sucursal activa
export const MOCK_BRANCH = {
  id: 'branch-001',
  name: 'Villa Crespo',
  latitude: -34.5954,
  longitude: -58.4445,
  allowedRadiusMeters: 50,
};

// Token dinámico actual (en producción cambia cada 4h)
export const MOCK_TOKEN = {
  code: 'AK4',
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas desde ahora
};

// Pool de palabras para canje
export const REWARD_WORDS = [
  'NUBE', 'CAFÉ', 'LUNA', 'SOL', 'BRISA', 'MONTE', 'ROCA', 'MAR',
  'FLOR', 'NIEVE', 'FUEGO', 'VIENTO', 'ÁRBOL', 'PIEDRA', 'RÍO', 'LAGO',
];

export const getRandomRewardWords = (): string => {
  const w1 = REWARD_WORDS[Math.floor(Math.random() * REWARD_WORDS.length)];
  let w2 = REWARD_WORDS[Math.floor(Math.random() * REWARD_WORDS.length)];
  while (w2 === w1) w2 = REWARD_WORDS[Math.floor(Math.random() * REWARD_WORDS.length)];
  return `${w1} ${w2}`;
};
