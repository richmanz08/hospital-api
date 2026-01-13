-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name_eng VARCHAR(255) NOT NULL,
    full_name_th VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    national_id CHAR(13) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    age INTEGER,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Add constraint to ensure national_id is exactly 13 digits
ALTER TABLE staff ADD CONSTRAINT chk_national_id_length 
    CHECK (national_id ~ '^[0-9]{13}$');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_national_id ON staff(national_id);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_deleted_at ON staff(deleted_at);

-- Insert sample data
INSERT INTO staff (full_name_eng, full_name_th, nickname, national_id, role, age) VALUES
('Somchai Jaidee', 'สมชาย ใจดี', 'ชาย', '1234567890123', 'Doctor', 35),
('Somying Raksuk', 'สมหญิง รักสุข', 'หญิง', '1234567890124', 'Nurse', 28);
