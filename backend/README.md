# Backend Setup — Node.js + Express

Folder ini berisi setup awal backend berbasis **Node.js**, **Express**, dan **TypeScript**.

## Struktur
```
backend/
├── src/
│   └── index.ts     # Entry point server Express
├── .env.example     # Template environment variable
├── tsconfig.json
└── package.json
```

## Menjalankan
```bash
npm install
cp .env.example .env   # Isi GEMINI_API_KEY
npm run dev
```

Server berjalan di: `http://localhost:5000`
