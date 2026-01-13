-- Seed data for patients
INSERT INTO patients (first_name, last_name, date_of_birth, phone, gender, national_id, nickname, age) VALUES
('สมชาย', 'ใจดี', '1990-05-15', '0812345678', 'MALE', '1710500396171', 'ชาย', 33),
('สมหญิง', 'รักสุข', '1985-08-20', '0898765432', 'FEMALE', '1710200396171', 'หญิง', 38),
('วิชัย', 'มั่นคง', '1988-03-10', '0823456789', 'MALE', '1710510396171', 'ชัย', 35)
ON CONFLICT DO NOTHING;
