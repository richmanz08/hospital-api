-- Create patients_medical_info table
CREATE TABLE IF NOT EXISTS patients_medical_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    blood_group VARCHAR(10),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    drug_allergy TEXT,
    food_allergy TEXT,
    chronic_disease TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Add constraint for blood group values
ALTER TABLE patients_medical_info ADD CONSTRAINT chk_blood_group 
    CHECK (blood_group IN ('A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'));

-- Create index on patient_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_medical_info_patient_id ON patients_medical_info(patient_id);

-- Create index on deleted_at
CREATE INDEX IF NOT EXISTS idx_patients_medical_info_deleted_at ON patients_medical_info(deleted_at);

-- Add constraint to ensure one medical info record per patient (excluding soft-deleted records)
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_medical_info_unique_patient 
    ON patients_medical_info(patient_id) WHERE deleted_at IS NULL;
