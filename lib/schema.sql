-- Local Service Profile & Booking Link System
-- Database Schema for Neon PostgreSQL

-- Providers table (core account + profile)
CREATE TABLE providers (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  service VARCHAR(100),
  city VARCHAR(100),
  area VARCHAR(100),
  photo_url TEXT,
  language VARCHAR(5) DEFAULT 'en',
  whatsapp VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability table (morning/afternoon/evening per weekday)
CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  morning BOOLEAN DEFAULT false,
  afternoon BOOLEAN DEFAULT false,
  evening BOOLEAN DEFAULT false,
  UNIQUE(provider_id, day_of_week)
);

-- Booking requests table
CREATE TABLE booking_requests (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  customer_mobile VARCHAR(15) NOT NULL,
  customer_address TEXT,
  preferred_date DATE,
  preferred_time VARCHAR(20),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  seen BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table (for future payment tracking)
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  plan VARCHAR(50) DEFAULT 'free',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration: add description and experience columns (run if not already present)
ALTER TABLE providers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX idx_providers_mobile ON providers(mobile);
CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_availability_provider ON availability(provider_id);
CREATE INDEX idx_booking_requests_provider ON booking_requests(provider_id);
CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
