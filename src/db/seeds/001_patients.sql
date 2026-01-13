-- Seed data for patients
INSERT INTO patients (first_name, last_name, date_of_birth, phone, email) VALUES
('สมชาย', 'ใจดี', '1990-05-15', '081-234-5678', 'somchai@example.com'),
('สมหญิง', 'รักสุข', '1985-08-20', '089-876-5432', 'somying@example.com'),
('วิชัย', 'มั่นคง', '1988-03-10', '082-345-6789', 'wichai@example.com')
ON CONFLICT DO NOTHING;
