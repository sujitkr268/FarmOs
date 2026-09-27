-- =====================================
-- FARMSOS DATABASE SCHEMA
-- =====================================


-- =====================================
-- USERS TABLE
-- =====================================

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


-- =====================================
-- HARVESTS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS harvests (

    id SERIAL PRIMARY KEY,

    farmer_id INTEGER NOT NULL,

    crop_name VARCHAR(100) NOT NULL,

    quantity DECIMAL(10,2) NOT NULL,

    unit VARCHAR(20) NOT NULL DEFAULT 'kg',

    price DECIMAL(10,2) NOT NULL,

    location VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (
            status IN (
                'available',
                'sold',
                'reserved'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_farmer
        FOREIGN KEY (farmer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =====================================
-- INTERESTS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS interests (

    id SERIAL PRIMARY KEY,

    harvest_id INTEGER NOT NULL,

    buyer_id INTEGER NOT NULL,

    message TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'accepted',
                'rejected'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_harvest
        FOREIGN KEY (harvest_id)
        REFERENCES harvests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =====================================
-- PUBLIC TRADERS TABLE
-- =====================================

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


-- =====================================
-- EXTEND USERS TABLE FOR BUYER PROFILES
-- =====================================

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


-- =====================================
-- MARKET PRICE HISTORY TABLE
-- =====================================

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

CREATE INDEX IF NOT EXISTS idx_mph_comm_state_date ON market_price_history (commodity, state, arrival_date);
CREATE INDEX IF NOT EXISTS idx_mph_comm_state_mkt_date ON market_price_history (commodity, state, market, arrival_date);


