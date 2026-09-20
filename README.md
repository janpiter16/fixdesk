# FixDesk

Sistem Manajemen Operasional Tiket Servis Bengkel & Elektronik

## Setup

```bash
cd fixdesk
npm install
npm run dev
```

## Struktur Project

```
fixdesk/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- clsx/tailwind-merge (utility)
- date-fns (date handling)
