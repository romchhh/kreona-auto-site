# West Auto Shipping

Окремий лендинг для пригону авто з США.

Скопійовано з прототипу `/west-auto` у репозиторії prototypes.

## Запуск

```bash
cd west-auto-shipping
npm install
npm run dev
```

Сайт відкриється на [http://localhost:3000](http://localhost:3000).

## Структура

```
west-auto-shipping/
├── public/hero.png          # фото hero
├── src/app/
│   ├── page.tsx             # головна сторінка
│   ├── layout.tsx
│   ├── brand.ts             # контакти, шляхи до фото
│   ├── west-auto.css        # кольори бренду
│   └── components/          # Navbar, Hero, ContactSection, Footer
```

## Деплой

Проєкт — повноцінний Next.js app. Можна деплоїти окремо на Vercel / Netlify / власний сервер.
