-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Insert sample data
INSERT INTO patients (first_name, last_name, date_of_birth, phone, email) VALUES
('สมชาย', 'ใจดี', '1990-05-15', '081-234-5678', 'somchai@example.com'),
('สมหญิง', 'รักสุข', '1985-08-20', '089-876-5432', 'somying@example.com');
