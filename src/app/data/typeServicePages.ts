export const TYPE_IMAGES = {
  yacht: '/services/types/yacht.jpg',
  sailYacht: '/services/types/sail-yacht.jpg',
  jetSki: '/services/types/jet-ski.jpg',
  otherWater: '/services/types/other-water.webp',
  special: '/services/types/special.jpg',
  construction: '/services/types/construction.jpg',
  agricultural: '/services/types/agricultural.jpg',
  otherOversized: '/services/types/other-oversized.jpg',
} as const

export const TYPE_SERVICE_PAGES = {
  water: {
    id: 'water' as const,
    path: '/poslugy/vodnyy',
    image: '/services/types/yacht.jpg',
    typeKeys: ['yacht', 'sailYacht', 'jetSki', 'otherWater'] as const,
  },
  oversized: {
    id: 'oversized' as const,
    path: '/poslugy/gabaryt',
    image: '/services/velykogabarytnyy-transport.jpg',
    typeKeys: ['special', 'construction', 'agricultural', 'otherOversized'] as const,
  },
} as const

export type TypeServicePageId = keyof typeof TYPE_SERVICE_PAGES
export type TypeImageKey = keyof typeof TYPE_IMAGES
