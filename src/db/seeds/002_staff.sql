-- Seed data for staff
INSERT INTO staff (full_name_eng, full_name_th, nickname, national_id, phone, gender, role, age, hire_date) VALUES
('Somchai Jaidee', 'สมชาย ใจดี', 'ชาย', '1234567890123', '0812345678', 'MALE', 'Doctor', 35, '2020-01-15'),
('Somying Raksuk', 'สมหญิง รักสุข', 'หญิง', '1234567890124', '0823456789', 'FEMALE', 'Nurse', 28, '2021-03-01'),
('Wichai Mankong', 'วิชัย มั่นคง', 'ชัย', '1234567890125', '0834567890', 'MALE', 'Pharmacist', 32, '2019-06-20')
ON CONFLICT DO NOTHING;
