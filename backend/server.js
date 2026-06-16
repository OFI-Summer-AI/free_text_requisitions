import 'dotenv/config';
import express from 'express';
import cors    from 'cors';
import pg      from 'pg';

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();

// Allow requests from the Vercel frontend (set ALLOWED_ORIGIN in Railway env vars)
// Falls back to '*' during local development if not set
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── GET /api/matched-catalogue ──────────────────────────────────
// Returns all rows from the matched_catalogue table in Railway,
// ordered newest first.
app.get('/api/matched-catalogue', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM   matched_catalog
      ORDER  BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    // Table doesn't exist yet — return empty array gracefully
    if (err.code === '42P01') return res.json([]);
    console.error('[matched-catalog]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Railway injects PORT automatically — use it
const PORT = process.env.PORT || process.env.API_PORT || 3001;
app.listen(PORT, () =>
  console.log(`[api-server] listening on port ${PORT}`)
);
