import mysql, { type Pool, type PoolOptions, type QueryResult } from 'mysql2/promise';

/**
 * Remote MySQL (e.g. Aiven) often needs a longer connectTimeout and keep-alive.
 * Without this, concurrent cold starts frequently throw ETIMEDOUT.
 */
function buildPoolConfig(): PoolOptions {
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  const useSsl =
    process.env.DB_SSL === 'true' ||
    process.env.DB_SSL === '1' ||
    // Aiven / most managed MySQL require TLS by default
    (process.env.DB_HOST || '').includes('aivencloud.com') ||
    (process.env.DB_HOST || '').includes('rds.amazonaws.com');

  const config: PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number.isFinite(port) ? port : 3306,

    waitForConnections: true,
    connectionLimit: process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE, 10) : 5,
    maxIdle: 5,
    idleTimeout: 60_000,
    queueLimit: 25,

    // Critical for remote DBs — default is often too aggressive
    connectTimeout: process.env.DB_CONNECT_TIMEOUT
      ? parseInt(process.env.DB_CONNECT_TIMEOUT, 10)
      : 20_000,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,

    // Avoid silent timezone surprises
    timezone: 'Z',
    dateStrings: false,
  };

  if (useSsl) {
    config.ssl = {
      // Managed providers (Aiven, etc.) — set DB_SSL_REJECT_UNAUTHORIZED=true + CA for strict prod
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    };
  }

  return config;
}

const pool: Pool = mysql.createPool(buildPoolConfig());

/** One retry on transient connect timeouts (common on cold remote pools). */
export async function queryWithRetry<T extends QueryResult = QueryResult>(
  sql: string,
  params?: unknown[],
): Promise<[T, unknown]> {
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await pool.query(sql, params as never[]);
      return result as [T, unknown];
    } catch (err) {
      lastError = err;
      const code = (err as { code?: string })?.code;
      const retryable =
        code === 'ETIMEDOUT' ||
        code === 'ECONNRESET' ||
        code === 'PROTOCOL_CONNECTION_LOST' ||
        code === 'ECONNREFUSED';

      if (!retryable || attempt === maxAttempts) {
        throw err;
      }

      // Brief backoff before reusing / refreshing a connection
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }

  throw lastError;
}

// Default export stays drop-in compatible with existing `db.query(...)` call sites
const db = {
  query: pool.query.bind(pool),
  execute: pool.execute.bind(pool),
  getConnection: pool.getConnection.bind(pool),
  end: pool.end.bind(pool),
  pool,
};

export default db;
