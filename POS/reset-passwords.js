/**
 * reset-passwords.js
 * Run once from E:\POS to fix demo user passwords:
 *   node reset-passwords.js
 */
require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function run() {
  const client = new Client({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    user:     process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'pos_db',
  });

  await client.connect();
  console.log('✅ Connected to', process.env.DB_DATABASE || 'pos_db');

  const USERS = [
    { username: 'admin',   email: 'admin@restaurant.com',   password: 'admin123',   role: 'admin',   full_name: 'Administrator' },
    { username: 'manager', email: 'manager@restaurant.com', password: 'manager123', role: 'manager', full_name: 'Manager' },
    { username: 'cashier', email: 'cashier@restaurant.com', password: 'cashier123', role: 'cashier', full_name: 'Cashier' },
  ];

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 12);

    const existing = await client.query(
      'SELECT id FROM users WHERE username = $1', [u.username]
    );

    if (existing.rows.length > 0) {
      await client.query(
        'UPDATE users SET password = $1, is_active = true WHERE username = $2',
        [hash, u.username]
      );
      console.log(`🔑 Reset password for "${u.username}" → ${u.password}`);
    } else {
      await client.query(
        `INSERT INTO users (username, email, password, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, true)`,
        [u.username, u.email, hash, u.full_name, u.role]
      );
      console.log(`👤 Created user "${u.username}" → ${u.password}`);
    }
  }

  const { rows } = await client.query(
    'SELECT username, role, is_active FROM users ORDER BY role'
  );
  console.log('\n📋 All users in DB:');
  rows.forEach(r => console.log(`   ${r.username} (${r.role}) active=${r.is_active}`));

  await client.end();
  console.log('\n✅ Done! You can now log in with admin/admin123, manager/manager123, or cashier/cashier123');
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
