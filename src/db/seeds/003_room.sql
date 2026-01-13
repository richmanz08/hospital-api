-- Seed data for room
INSERT INTO room (room_number, building, floor, room_type, capacity, facilities) VALUES
-- Building A - General Ward
('A-101', 'A', 1, 'GENERAL', 6, ARRAY['TV', 'Fan', 'Shared Bathroom']),
('A-102', 'A', 1, 'GENERAL', 6, ARRAY['TV', 'Fan', 'Shared Bathroom']),
('A-103', 'A', 1, 'GENERAL', 4, ARRAY['TV', 'Fan', 'Shared Bathroom']),
('A-201', 'A', 2, 'SEMI_PRIVATE', 2, ARRAY['TV', 'Air Conditioning', 'Private Bathroom']),
('A-202', 'A', 2, 'SEMI_PRIVATE', 2, ARRAY['TV', 'Air Conditioning', 'Private Bathroom']),
('A-203', 'A', 2, 'PRIVATE', 1, ARRAY['TV', 'Air Conditioning', 'Private Bathroom', 'WiFi', 'Refrigerator']),
('A-301', 'A', 3, 'VIP', 1, ARRAY['TV', 'Air Conditioning', 'Private Bathroom', 'WiFi', 'Refrigerator', 'Sofa', 'Microwave']),
('A-302', 'A', 3, 'VIP', 1, ARRAY['TV', 'Air Conditioning', 'Private Bathroom', 'WiFi', 'Refrigerator', 'Sofa', 'Microwave']),

-- Building B - ICU & Critical Care
('B-101', 'B', 1, 'ICU', 1, ARRAY['Ventilator', 'Heart Monitor', 'IV Pump', 'Suction']),
('B-102', 'B', 1, 'ICU', 1, ARRAY['Ventilator', 'Heart Monitor', 'IV Pump', 'Suction']),
('B-103', 'B', 1, 'ICU', 1, ARRAY['Ventilator', 'Heart Monitor', 'IV Pump', 'Suction']),
('B-104', 'B', 1, 'ICU', 1, ARRAY['Ventilator', 'Heart Monitor', 'IV Pump', 'Suction']),

-- Building B - Operating & Recovery
('B-201', 'B', 2, 'OPERATING_THEATER', 1, ARRAY['Anesthesia Machine', 'Surgical Lights', 'Surgical Table', 'Monitor']),
('B-202', 'B', 2, 'OPERATING_THEATER', 1, ARRAY['Anesthesia Machine', 'Surgical Lights', 'Surgical Table', 'Monitor']),
('B-203', 'B', 2, 'RECOVERY', 2, ARRAY['Heart Monitor', 'Oxygen Supply', 'IV Pump']),
('B-204', 'B', 2, 'RECOVERY', 2, ARRAY['Heart Monitor', 'Oxygen Supply', 'IV Pump'])
ON CONFLICT (room_number) DO NOTHING;
