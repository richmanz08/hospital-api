-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create room table
CREATE TABLE IF NOT EXISTS room (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    building VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    facilities TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Add constraint for room type values
ALTER TABLE room ADD CONSTRAINT chk_room_type 
    CHECK (room_type IN ('GENERAL', 'ICU', 'OPERATING_THEATER', 'RECOVERY', 'VIP', 'SEMI_PRIVATE', 'PRIVATE'));