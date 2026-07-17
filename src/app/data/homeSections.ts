export const DIRECTIONS = [
  {
    id: 'usa',
    code: 'USA',
    crop: { x: '16%', y: '40%', scale: 2.35 },
  },
  {
    id: 'canada',
    code: 'CA',
    crop: { x: '18%', y: '22%', scale: 2.15 },
  },
  {
    id: 'europe',
    code: 'EU',
    crop: { x: '52%', y: '30%', scale: 2.55 },
  },
  {
    id: 'korea',
    code: 'KR',
    crop: { x: '84%', y: '38%', scale: 3.1 },
  },
] as const

export const SERVICES = [
  {
    id: 'pidbir',
    slug: 'pidbir',
    image: '/services/pidbir.png',
    theme: 'dark',
  },
  {
    id: 'vin',
    slug: 'perevirka-vin',
    image: '/services/perevirka-vin.png',
    theme: 'photo',
  },
  {
    id: 'kupivlya',
    slug: 'kupivlya-avtomobilya',
    image: '/services/kupivlya.png',
    theme: 'photoAlt',
  },
  {
    id: 'dostavka',
    slug: 'dostavka',
    image: '/services/dostavka.jpg',
    theme: 'light',
  },
  {
    id: 'mytnytsya',
    slug: 'mytne-oformlennya',
    image: '/services/mytne-oformlennya.png',
    theme: 'dark',
  },
  {
    id: 'sertyfikatsiya',
    slug: 'sertyfikatsiya',
    image: '/services/sertyfikatsiya.png',
    theme: 'photo',
  },
  {
    id: 'remont',
    slug: 'organizatsiya-remontu',
    image: '/services/remont.jpg',
    theme: 'photoAlt',
  },
  {
    id: 'suprovid',
    slug: 'povnyy-suprovid',
    image: '/services/povnyy-suprovid.png',
    theme: 'light',
  },
] as const

export const PROCESS_ICONS = [
  'form',
  'chat',
  'search',
  'doc',
  'gavel',
  'ship',
  'wrench',
  'customs',
  'key',
] as const

export const WHY_ICONS = [
  'experience',
  'auction',
  'contract',
  'check',
  'media',
  'support',
  'personal',
] as const

