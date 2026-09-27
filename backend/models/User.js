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
    ALTER TABLE users ADD COLUMN IF NOT EXISTS required_grade VARCHAR(50) DEFAULT 'Any';

    ALTER TABLE harvests ADD COLUMN IF NOT EXISTS grade VARCHAR(50) DEFAULT 'FAQ Grade';

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, verification_status);
    CREATE INDEX IF NOT EXISTS idx_users_district_state ON users(district, state);
    CREATE INDEX IF NOT EXISTS idx_harvests_farmer_status ON harvests(farmer_id, status);
    CREATE INDEX IF NOT EXISTS idx_harvests_crop_name ON harvests(crop_name);
    CREATE INDEX IF NOT EXISTS idx_harvests_created_at ON harvests(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_traders_status ON public_traders(verification_status);
    CREATE INDEX IF NOT EXISTS idx_traders_state_district ON public_traders(state, district);
  `;

  try {
    await pool.query(query);
    console.log("Users table, grade columns & DB indexes ready");
  } catch (error) {
    console.error("Error creating/updating users table & indexes:", error.message);
  }
};

const User = {
  createUsersTable,
};

module.exports = User;
