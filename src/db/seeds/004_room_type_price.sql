-- Seed data for room_type_price master table
INSERT INTO room_type_price (room_type, name_en, name_th, description, base_price_per_day) VALUES
('GENERAL', 'General Ward', 'ห้องสามัญ', 'ห้องรวม 4-6 เตียง มีสิ่งอำนวยความสะดวกพื้นฐาน', 800.00),
('SEMI_PRIVATE', 'Semi-Private Room', 'ห้องกึ่งพิเศษ', 'ห้อง 2 เตียง มีห้องน้ำในตัว', 1500.00),
('PRIVATE', 'Private Room', 'ห้องพิเศษ', 'ห้องเดี่ยว มีห้องน้ำในตัว TV WiFi', 3000.00),
('VIP', 'VIP Room', 'ห้อง VIP', 'ห้องเดี่ยวขนาดใหญ่ พร้อมโซฟา ตู้เย็น TV WiFi', 8000.00),
('ICU', 'Intensive Care Unit', 'ห้อง ICU', 'ห้องผู้ป่วยวิกฤต มีอุปกรณ์ช่วยชีวิตครบครัน', 15000.00),
('CCU', 'Cardiac Care Unit', 'ห้อง CCU', 'ห้องผู้ป่วยโรคหัวใจวิกฤต', 15000.00),
('NICU', 'Neonatal ICU', 'ห้อง NICU', 'ห้องผู้ป่วยทารกแรกเกิดวิกฤต', 12000.00),
('OPERATING_THEATER', 'Operating Theater', 'ห้องผ่าตัด', 'ห้องผ่าตัดพร้อมอุปกรณ์ครบครัน', 50000.00),
('RECOVERY', 'Recovery Room', 'ห้องพักฟื้น', 'ห้องพักฟื้นหลังผ่าตัด', 5000.00),
('ER', 'Emergency Room', 'ห้องฉุกเฉิน', 'ห้องฉุกเฉินสำหรับผู้ป่วยฉุกเฉิน', 3000.00),
('ISOLATION', 'Isolation Room', 'ห้องแยกโรค', 'ห้องแยกสำหรับผู้ป่วยติดเชื้อ', 5000.00)
ON CONFLICT (room_type) DO NOTHING;
