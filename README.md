# AM Preset Finder — Jiyyad Tools

Web tool untuk mencari preset **Alight Motion** dari link TikTok.  
Tema Neo Brutalism + animasi smooth. Proxy Express stabil (tanpa CORS).

## Cara jalanin

```bash
# 1. Install dependency
npm install

# 2. Jalankan server
npm start
```

Buka browser: **http://localhost:3000**

## Endpoint proxy

| Method | Path         | Body              |
|--------|--------------|-------------------|
| POST   | `/api/preset`| `{ "url": "..." }`|
| GET    | `/api/health`| —                 |

Upstream API: `https://api.zyvor.my.id/api/am/presetv2`

## Fitur

- Input link TikTok (vt.tiktok / www.tiktok.com)
- Tampilkan video + info user + stats
- Daftar preset AM (salin / buka)
- UI Neo Brutalism + animasi bervariasi
- Proxy Express dengan timeout 45s

## Tech

- Frontend: HTML + CSS + Vanilla JS
- Backend: Express + cors + node-fetch
- Brand: **Jiyyad Tools**

---
© 2026 Jiyyad Tools
