-- PostgreSQL Script to add "dimension" field to the "arts" table
ALTER TABLE arts ADD COLUMN IF NOT EXISTS dimension VARCHAR(100);

-- Populate existing rows with random dimension values
UPDATE arts 
SET dimension = (ARRAY['24x36 in', '18x24 in', '12x12 in', '20x30 in', '36x36 in', '16x20 in', '20x20 in', '30x40 in', '40x60 in', '16x16 in', '30x30 in', '11x14 in'])[floor(random() * 12 + 1)]
WHERE dimension IS NULL;
