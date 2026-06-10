const db = require('../config/db');

// Create new art item
exports.createArt = async (req, res, next) => {
  try {
    const { type, material, color, shape, special_edition, image_url, price, description, dimension } = req.body;

    const result = await db.query(
      `INSERT INTO arts (type, material, color, shape, special_edition, image_url, price, description, dimension) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [type, material, color, shape, special_edition || false, image_url, price, description, dimension]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Get all arts (with optional filters)
exports.getArts = async (req, res, next) => {
  try {
    const { type, material, color, shape, special_edition } = req.query;

    let query = 'SELECT * FROM arts WHERE 1=1';
    const params = [];

    let paramIndex = 1;
    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }
    if (material) {
      query += ` AND material = $${paramIndex++}`;
      params.push(material);
    }
    if (color) {
      query += ` AND color = $${paramIndex++}`;
      params.push(color);
    }
    if (shape) {
      query += ` AND shape = $${paramIndex++}`;
      params.push(shape);
    }
    if (special_edition !== undefined) {
      query += ` AND special_edition = $${paramIndex++}`;
      params.push(special_edition === 'true');
    }

    query += ' ORDER BY id ASC';

    const result = await db.query(query, params);
    res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// Get art by ID
exports.getArtById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM arts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Art item not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Update art
exports.updateArt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bodyArgs = req.body;

    // Check if art exists
    const artCheck = await db.query('SELECT * FROM arts WHERE id = $1', [id]);
    if (artCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Art item not found' });
    }

    const art = artCheck.rows[0];

    // Combine existing values with updated ones
    const type = bodyArgs.type || art.type;
    const material = bodyArgs.material || art.material;
    const color = bodyArgs.color || art.color;
    const shape = bodyArgs.shape || art.shape;
    const special_edition = bodyArgs.special_edition !== undefined ? bodyArgs.special_edition : art.special_edition;
    const image_url = bodyArgs.image_url || art.image_url;
    const price = bodyArgs.price || art.price;
    const description = bodyArgs.description || art.description;
    const dimension = bodyArgs.dimension !== undefined ? bodyArgs.dimension : art.dimension;

    const result = await db.query(
      `UPDATE arts 
       SET type = $1, material = $2, color = $3, shape = $4, special_edition = $5, image_url = $6, price = $7, description = $8, dimension = $9
       WHERE id = $10 RETURNING *`,
      [type, material, color, shape, special_edition, image_url, price, description, dimension, id]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Delete art
exports.deleteArt = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM arts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Art item not found' });
    }

    res.status(200).json({ success: true, message: 'Art item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
