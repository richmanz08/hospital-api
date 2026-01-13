-- Seed data for patients_medical_info
INSERT INTO patients_medical_info (patient_id, blood_group, height, weight, drug_allergy, food_allergy, chronic_disease) 
SELECT 
    p.id,
    CASE 
        WHEN p.first_name = 'สมชาย' THEN 'O+'
        WHEN p.first_name = 'สมหญิง' THEN 'A+'
        WHEN p.first_name = 'วิชัย' THEN 'B+'
    END as blood_group,
    CASE 
        WHEN p.first_name = 'สมชาย' THEN 175.50
        WHEN p.first_name = 'สมหญิง' THEN 160.00
        WHEN p.first_name = 'วิชัย' THEN 170.00
    END as height,
    CASE 
        WHEN p.first_name = 'สมชาย' THEN 70.50
        WHEN p.first_name = 'สมหญิง' THEN 55.00
        WHEN p.first_name = 'วิชัย' THEN 75.00
    END as weight,
    CASE 
        WHEN p.first_name = 'สมชาย' THEN 'Penicillin'
        WHEN p.first_name = 'สมหญิง' THEN 'ไม่มี'
        WHEN p.first_name = 'วิชัย' THEN 'Aspirin'
    END as drug_allergy,
    CASE 
        WHEN p.first_name = 'สมชาย' THEN 'กุ้ง, ปู'
        WHEN p.first_name = 'สมหญิง' THEN 'ไม่มี'
        WHEN p.first_name = 'วิชัย' THEN 'ไข่'
    END as food_allergy,
    CASE 
        WHEN p.first_name = 'สมชาย' THEN 'ความดันโลหิตสูง'
        WHEN p.first_name = 'สมหญิง' THEN 'เบาหวาน'
        WHEN p.first_name = 'วิชัย' THEN 'ไม่มี'
    END as chronic_disease
FROM patients p
WHERE p.deleted_at IS NULL
ON CONFLICT DO NOTHING;
