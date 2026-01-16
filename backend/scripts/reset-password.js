#!/usr/bin/env node
import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

// Get database URL from Fly.io secret or environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  console.error('Usage: DATABASE_URL=<url> node reset-password.js <email> <new-password>');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node reset-password.js <email> <new-password>');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function resetPassword() {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'UPDATE allowed_users SET password_hash = $1 WHERE LOWER(email) = $2 RETURNING email',
      [passwordHash, normalizedEmail]
    );

    if (result.rowCount === 0) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✓ Password reset for ${result.rows[0].email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetPassword();
