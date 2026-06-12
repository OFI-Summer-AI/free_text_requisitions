import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:QgLZuHwZjhAJydJSrqYZzQAzvKLOuLfJ@maglev.proxy.rlwy.net:45488/railway' });

const { rows } = await pool.query(`SELECT * FROM matched_catalog LIMIT 10`);
console.log('Row count:', rows.length);
if (rows.length) {
  console.log('Columns:', Object.keys(rows[0]));
  console.log('Sample row:', JSON.stringify(rows[0], null, 2));
}
await pool.end();
