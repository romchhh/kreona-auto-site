import type { MetadataRoute } from 'next'
import { SITE_NAME } from './seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'KREONA',
    description:
      'Автомобілі з США, Європи, Канади та Кореї під ключ - підбір, купівля та доставка.',
    start_url: '/uk',
    id: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFFFFF',
    theme_color: '#9AB11C',
    lang: 'uk',
    dir: 'ltr',
    categories: ['business', 'shopping'],
    icons: [
      {
        src: '/favicon.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
