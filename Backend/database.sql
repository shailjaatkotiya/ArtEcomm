-- Create types for filters
CREATE TYPE art_type AS ENUM ('wall decor', 'room decor', 'digital');
CREATE TYPE art_material AS ENUM ('canvas', 'paper', 'prints');
CREATE TYPE art_color AS ENUM ('acrylic', 'poster');
CREATE TYPE art_shape AS ENUM ('landscape', 'portrait', 'square');

-- 1. Arts Table
CREATE TABLE arts (
    id SERIAL PRIMARY KEY,
    type art_type,
    material art_material,
    color art_color,
    shape art_shape,
    special_edition BOOLEAN DEFAULT FALSE,
    image_url TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255), -- 2-5 words description
    dimension VARCHAR(100)
);

-- 2. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    number VARCHAR(20),
    address TEXT
);

-- 3. Cart Items Table 
-- (Instead of adding cartItems directly to the users table which violates 1NF, 
-- a junction table is the standard SQL way to associate multiple art items to a single user)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    art_id INT REFERENCES arts(id) ON DELETE CASCADE,
    UNIQUE(user_id, art_id)
);

-- 4. Orders Table
-- PostgreSQL supports array types, so we can store multiple art IDs in a single column using integer[].
-- (Alternatively, you could create an order_items junction table for strict foreign key constraints)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    art_ids INT[] NOT NULL, -- Array of Art IDs
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Dummy Data for Arts Table
INSERT INTO arts (type, material, color, shape, special_edition, image_url, price, description, dimension) VALUES
('wall decor', 'canvas', 'acrylic', 'landscape', false, 'https://example.com/art1.jpg', 120.00, 'Beautiful mountain sunset', '24x36 in'),
('room decor', 'paper', 'poster', 'portrait', true, 'https://example.com/art2.jpg', 45.50, 'Abstract geometric shapes', '18x24 in'),
('digital', 'prints', 'acrylic', 'square', false, 'https://example.com/art3.jpg', 60.00, 'Cyberpunk city vibes', '12x12 in'),
('wall decor', 'paper', 'poster', 'landscape', false, 'https://example.com/art4.jpg', 85.00, 'Vintage floral illustration', '20x30 in'),
('room decor', 'canvas', 'acrylic', 'square', true, 'https://example.com/art5.jpg', 150.00, 'Modern minimalist portrait', '36x36 in'),
('digital', 'canvas', 'poster', 'portrait', false, 'https://example.com/art6.jpg', 30.00, 'Neon lights typography', '16x20 in'),
('wall decor', 'prints', 'acrylic', 'landscape', false, 'https://example.com/art7.jpg', 95.00, 'Serene ocean waves', '24x36 in'),
('room decor', 'paper', 'acrylic', 'square', false, 'https://example.com/art8.jpg', 55.00, 'Botanical leaf study', '20x20 in'),
('digital', 'prints', 'poster', 'landscape', true, 'https://example.com/art9.jpg', 110.00, 'Future space exploration', '24x36 in'),
('wall decor', 'canvas', 'poster', 'portrait', false, 'https://example.com/art10.jpg', 75.00, 'Classic black and white', '18x24 in'),
('room decor', 'prints', 'acrylic', 'landscape', false, 'https://example.com/art11.jpg', 130.00, 'Vibrant forest painting', '30x40 in'),
('digital', 'paper', 'acrylic', 'square', false, 'https://example.com/art12.jpg', 40.00, 'Pop art collage', '12x12 in'),
('wall decor', 'prints', 'poster', 'portrait', true, 'https://example.com/art13.jpg', 160.00, 'Surreal dreamscape scene', '24x36 in'),
('room decor', 'canvas', 'acrylic', 'landscape', false, 'https://example.com/art14.jpg', 200.00, 'Large abstract expression', '40x60 in'),
('digital', 'canvas', 'acrylic', 'square', false, 'https://example.com/art15.jpg', 50.00, 'Retro synthwave grid', '16x16 in'),
('wall decor', 'paper', 'poster', 'landscape', false, 'https://example.com/art16.jpg', 70.00, 'Detailed architectural sketch', '20x30 in'),
('room decor', 'prints', 'poster', 'portrait', false, 'https://example.com/art17.jpg', 90.00, 'Watercolor animal portrait', '18x24 in'),
('digital', 'paper', 'acrylic', 'landscape', true, 'https://example.com/art18.jpg', 140.00, 'Fantasy concept art', '24x36 in'),
('wall decor', 'canvas', 'acrylic', 'square', false, 'https://example.com/art19.jpg', 180.00, 'Textured oil painting', '30x30 in'),
('room decor', 'prints', 'poster', 'portrait', false, 'https://example.com/art20.jpg', 65.00, 'Simple line art doodle', '11x14 in');
