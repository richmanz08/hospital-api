-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name_eng VARCHAR(255) NOT NULL,
    full_name_th VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    national_id CHAR(13) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    role VARCHAR(100) NOT NULL,
    age INTEGER,
    profile_image_url TEXT,
    hire_date DATE NOT NULL,
    termination_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Add constraint to ensure national_id is exactly 13 digits
ALTER TABLE staff ADD CONSTRAINT chk_national_id_length 
    CHECK (national_id ~ '^[0-9]{13}$');

-- Add constraint for gender values
ALTER TABLE staff ADD CONSTRAINT chk_gender 
    CHECK (gender IN ('MALE', 'FEMALE', 'OTHER'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_national_id ON staff(national_id);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_deleted_at ON staff(deleted_at);
