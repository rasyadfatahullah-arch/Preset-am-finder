/**
 * Jiyyad Tools — AM Preset Finder
 * Stable Express proxy for Zyvor API
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = 'https://api.zyvor.my.id/api/am/presetv2';
const TIMEOUT_MS = 45000; // 45s — API can be slow

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Jiyyad Tools — AM Finder',
    time: new Date().toISOString()
  });
});

// Proxy: POST /api/preset
app.post('/api/preset', async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      status: false,
      found: false,
      message: 'Parameter "url" wajib diisi.'
    });
  }

  const trimmed = url.trim();
  if (!trimmed.includes('tiktok.com') && !trimmed.includes('vt.tiktok')) {
    return res.status(400).json({
      status: false,
      found: false,
      message: 'Link tidak valid. Pastikan itu link TikTok.'
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JiyyadTools-AMFinder/1.0',
        Accept: 'application/json'
      },
      body: JSON.stringify({ url: trimmed }),
      signal: controller.signal
    });

    clearTimeout(timer);

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        status: false,
        found: false,
        message: 'Respons API tidak valid (bukan JSON).'
      });
    }

    // Forward status code from upstream when possible
    const statusCode = response.ok ? 200 : response.status >= 400 ? response.status : 502;
    return res.status(statusCode).json(data);
  } catch (err) {
    clearTimeout(timer);

    if (err.name === 'AbortError') {
      return res.status(504).json({
        status: false,
        found: false,
        message: 'Timeout: API terlalu lama merespons. Coba lagi.'
      });
    }

    console.error('[proxy error]', err.message);
    return res.status(502).json({
      status: false,
      found: false,
      message: 'Gagal terhubung ke API. Coba beberapa saat lagi.'
    });
  }
});

// Fallback: serve index.html for SPA-style routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   Jiyyad Tools — AM Preset Finder    ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║   Local:  http://localhost:${PORT}        ║`);
  console.log('  ║   Proxy:  POST /api/preset           ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
