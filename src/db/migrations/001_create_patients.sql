-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gender VARCHAR(10) NOT NULL,
    national_id CHAR(13) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    age INTEGER,
    date_of_birth DATE,
    phone VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Add constraint to ensure national_id is exactly 13 digits
ALTER TABLE patients ADD CONSTRAINT chk_national_id_length 
    CHECK (national_id ~ '^[0-9]{13}$');


-- Add constraint for gender values
ALTER TABLE patients ADD CONSTRAINT chk_gender 
    CHECK (gender IN ('MALE', 'FEMALE', 'OTHER'));


-- Create index on deleted_at
CREATE INDEX IF NOT EXISTS idx_patients_deleted_at ON patients(deleted_at);
