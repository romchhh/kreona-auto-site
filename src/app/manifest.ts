import type { MetadataRoute } from 'next'
import { SITE_NAME } from './seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Kreona',
    description:
      'Автомобілі з США, Європи, Канади та Кореї під ключ - підбір, купівля та доставка.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#9AB11C',
    lang: 'uk',
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
