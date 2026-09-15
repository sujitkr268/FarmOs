const { pool } = require("../config/db");

const createPublicTradersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS public_traders (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      business_type VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      district VARCHAR(100) NOT NULL,
      city VARCHAR(100),
      mandi VARCHAR(100),
      address TEXT,
      commodities TEXT NOT NULL,
      buying_capacity VARCHAR(100),
      official_website VARCHAR(255),
      official_contact_url VARCHAR(255),
      public_phone VARCHAR(50),
      public_email VARCHAR(255),
      registration_type VARCHAR(100),
      registration_reference VARCHAR(100),
      verification_source VARCHAR(255) NOT NULL,
      source_url VARCHAR(500) NOT NULL,
      source_type VARCHAR(100) NOT NULL,
      verification_status VARCHAR(50) NOT NULL DEFAULT 'source_verified'
          CHECK (verification_status IN ('source_verified', 'website_verified', 'unverified', 'needs_review')),
      last_verified DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Public traders table ready");
  } catch (error) {
    console.error("Error creating public_traders table:", error.message);
  }
};

module.exports = {
  createPublicTradersTable
};
