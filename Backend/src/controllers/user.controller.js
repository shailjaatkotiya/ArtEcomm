const db = require('../config/db');

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, number, address } = req.body;

    // Check if user already exists
    const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const result = await db.query(
      'INSERT INTO users (name, email, number, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, number, address]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, number, address } = req.body;

    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Since it's a partial update, use existing values if not provided
    const user = userCheck.rows[0];
    const updatedName = name || user.name;
    const updatedEmail = email || user.email;
    const updatedNumber = number !== undefined ? number : user.number;
    const updatedAddress = address !== undefined ? address : user.address;

    // If email is being changed, ensure it's not taken
    if (email && email !== user.email) {
      const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    const result = await db.query(
      'UPDATE users SET name = $1, email = $2, number = $3, address = $4 WHERE id = $5 RETURNING *',
      [updatedName, updatedEmail, updatedNumber, updatedAddress, id]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
