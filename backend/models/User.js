const { pool } = require("../config/db");

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'farmer'
        CHECK (role IN ('farmer', 'buyer', 'admin')),
      phone VARCHAR(20) NOT NULL,
      location VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS district VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS mandi VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS commodities TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS buying_capacity VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS enam_reference VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS udyam_reference VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS official_website VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS show_contact_publicly BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_notes TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS farm_size VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS crops_grown TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS village VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS farmer_reference VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS fpo_info VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_evidence TEXT;
  `;

  try {
    await pool.query(query);
    console.log("Users table & buyer columns ready");
  } catch (error) {
    console.error("Error creating/updating users table:", error.message);
  }
};

const User = {
  createUsersTable,
};

module.exports = User;
