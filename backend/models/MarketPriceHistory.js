const { pool } = require("../config/db");

// =====================================
// MARKET PRICE HISTORY MODEL
// =====================================

/**
 * Creates the market_price_history table and performance indexes if they don't exist
 */
const createMarketPriceHistoryTable = async () => {
  const tableQuery = `
    CREATE TABLE IF NOT EXISTS market_price_history (
        id SERIAL PRIMARY KEY,
        arrival_date DATE NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        market VARCHAR(100) NOT NULL,
        commodity VARCHAR(100) NOT NULL,
        variety VARCHAR(100) DEFAULT 'FAQ',
        grade VARCHAR(50) DEFAULT 'FAQ',
        min_price DECIMAL(10,2) NOT NULL,
        max_price DECIMAL(10,2) NOT NULL,
        modal_price DECIMAL(10,2) NOT NULL,
        price_unit VARCHAR(50) DEFAULT '₹/quintal',
        source VARCHAR(100) DEFAULT 'Agmarknet',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_mandi_record UNIQUE (arrival_date, state, market, commodity, variety, grade)
    );
  `;

  const indexQueries = `
    CREATE INDEX IF NOT EXISTS idx_mph_comm_state_date ON market_price_history (commodity, state, arrival_date);
    CREATE INDEX IF NOT EXISTS idx_mph_comm_state_mkt_date ON market_price_history (commodity, state, market, arrival_date);
  `;

  try {
    await pool.query(tableQuery);
    await pool.query(indexQueries);
    console.log("market_price_history table & indexes ready");
  } catch (err) {
    console.error("Error creating market_price_history table:", err.message);
  }
};

/**
 * Inserts a single historical mandi record (skips if unique constraint is violated)
 */
const insertHistoricalRecord = async (record) => {
  const query = `
    INSERT INTO market_price_history (
      arrival_date, state, district, market, commodity, variety, grade,
      min_price, max_price, modal_price, price_unit, source
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (arrival_date, state, market, commodity, variety, grade) DO NOTHING
    RETURNING id;
  `;

  const values = [
    record.arrival_date,
    record.state,
    record.district || record.state,
    record.market,
    record.commodity,
    record.variety || 'FAQ',
    record.grade || 'FAQ',
    record.min_price,
    record.max_price,
    record.modal_price,
    record.price_unit || '₹/quintal',
    record.source || 'Agmarknet'
  ];

  const result = await pool.query(query, values);
  return result.rows.length > 0;
};

/**
 * Retrieves historical modal prices filtered by commodity, state, market, date range
 * @param {Object} filters - { commodity, state, district, market, from, to }
 */
const getHistoricalPrices = async ({ commodity, state, district, market, from, to }) => {
  let whereClauses = [];
  let queryValues = [];
  let paramIdx = 1;

  if (commodity && typeof commodity === 'string' && commodity.trim()) {
    whereClauses.push(`LOWER(commodity) = LOWER($${paramIdx++})`);
    queryValues.push(commodity.trim());
  }

  if (state && typeof state === 'string' && state.trim()) {
    whereClauses.push(`LOWER(state) = LOWER($${paramIdx++})`);
    queryValues.push(state.trim());
  }

  if (district && typeof district === 'string' && district.trim()) {
    whereClauses.push(`LOWER(district) = LOWER($${paramIdx++})`);
    queryValues.push(district.trim());
  }

  if (market && typeof market === 'string' && market.trim()) {
    whereClauses.push(`LOWER(market) = LOWER($${paramIdx++})`);
    queryValues.push(market.trim());
  }

  if (from && typeof from === 'string' && from.trim()) {
    whereClauses.push(`arrival_date >= $${paramIdx++}`);
    queryValues.push(from.trim());
  }

  if (to && typeof to === 'string' && to.trim()) {
    whereClauses.push(`arrival_date <= $${paramIdx++}`);
    queryValues.push(to.trim());
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let query = '';
  if (market && typeof market === 'string' && market.trim()) {
    // Specific mandi requested: return daily modal price for that mandi
    query = `
      SELECT 
        TO_CHAR(arrival_date, 'YYYY-MM-DD') AS date,
        ROUND(AVG(modal_price))::INTEGER AS price,
        ROUND(AVG(modal_price))::INTEGER AS modal_price
      FROM market_price_history
      ${whereString}
      GROUP BY arrival_date
      ORDER BY arrival_date ASC;
    `;
  } else {
    // No specific mandi: aggregate state-wide modal price by date
    query = `
      SELECT 
        TO_CHAR(arrival_date, 'YYYY-MM-DD') AS date,
        ROUND(AVG(modal_price))::INTEGER AS price,
        ROUND(AVG(modal_price))::INTEGER AS modal_price
      FROM market_price_history
      ${whereString}
      GROUP BY arrival_date
      ORDER BY arrival_date ASC;
    `;
  }

  const result = await pool.query(query, queryValues);
  return result.rows;
};

module.exports = {
  createMarketPriceHistoryTable,
  insertHistoricalRecord,
  getHistoricalPrices
};
