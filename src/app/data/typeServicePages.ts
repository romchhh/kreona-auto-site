export const TYPE_SERVICE_PAGES = {
  water: {
    id: 'water' as const,
    path: '/poslugy/vodnyy',
    image: '/services/vodnyy-transport.jpg',
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
