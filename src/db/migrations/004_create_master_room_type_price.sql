-- Create room_type_price master table
CREATE TABLE IF NOT EXISTS room_type_price (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_type VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    description TEXT,
    base_price_per_day DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add constraint for room type values
ALTER TABLE room_type_price ADD CONSTRAINT chk_room_type_price_type 
    CHECK (room_type IN ('GENERAL', 'SEMI_PRIVATE', 'PRIVATE', 'VIP', 'ICU', 'CCU', 'NICU', 'OPERATING_THEATER', 'RECOVERY', 'ER', 'ISOLATION'));

-- Create index
CREATE INDEX IF NOT EXISTS idx_room_type_price_type ON room_type_price(room_type);
CREATE INDEX IF NOT EXISTS idx_room_type_price_active ON room_type_price(is_active);
