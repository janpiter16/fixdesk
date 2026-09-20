-- Seed Data for FixDesk

-- Insert device categories
INSERT INTO device_categories (name, slug) VALUES
('Smartphone', 'smartphone'),
('Laptop', 'laptop'),
('Tablet', 'tablet'),
('Smartwatch', 'smartwatch'),
('Desktop PC', 'desktop-pc'),
('Gaming Console', 'gaming-console');

-- Insert sample devices
INSERT INTO devices (category_id, brand, model) 
SELECT id, 'Apple', 'iPhone 13 Pro' FROM device_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'Samsung', 'Galaxy S23 Ultra' FROM device_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'Asus', 'TUF Gaming A15' FROM device_categories WHERE slug = 'laptop'
UNION ALL
SELECT id, 'Lenovo', 'ThinkPad X1 Carbon' FROM device_categories WHERE slug = 'laptop';

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, phone) VALUES
('admin@fixdesk.com', '$2b$10$rKvH8Y6xH7OzT8f2X9LzKOqZq3aZ8Y6xH7OzT8f2X9LzKOqZq3aZ8O', 'Admin FixDesk', 'owner', '081234567890');

-- Insert sample spare parts
INSERT INTO spare_parts (part_code, name, category, unit, purchase_price, selling_price, stock_qty, min_stock) VALUES
('LCD-IP13P', 'LCD iPhone 13 Pro', 'Display', 'pcs', 1500000, 2000000, 10, 3),
('BAT-IP13P', 'Battery iPhone 13 Pro', 'Battery', 'pcs', 300000, 450000, 15, 5),
('CHG-USBC', 'USB-C Charging Port', 'Port', 'pcs', 50000, 100000, 30, 10),
('FAN-ASUS', 'Cooling Fan ASUS TUF', 'Cooling', 'pcs', 150000, 250000, 8, 2);
