const pool = require('../config/db');

const getAllHomeUi = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, release_date, aquisition_method, store_banner
      FROM home_ui`
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No home UI entries found.'
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
}

const getHomeUiById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, release_date, aquisition_method, store_banner
      FROM home_ui
      WHERE id = $1`,
      [req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Home UI entry not found.'
      });

      return res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    next(error);
  }
}

const createHomeUi = async (req, res, next) => {
  try {
    const { title, release_date, aquisition_method, store_banner } = req.body;

    if (
      typeof title !== 'string' ||
      typeof release_date !== 'string' ||
      typeof aquisition_method !== 'string' ||
      (store_banner !== undefined && store_banner !== null && typeof store_banner !== 'string')
    ) {
      return res.status(400).json({
        message: 'Invalid input data.'
      });
    }

    const result = await pool.query(
      `INSERT INTO home_ui (title, release_date, aquisition_method, store_banner)
      VALUES ($1, $2, $3, $4)`,
      [title, release_date, aquisition_method, store_banner ?? null]
    )

    res.status(201).json({
      message: 'Home UI entry created successfully.'
    });
  } catch (error) {
    next(error);
  }
}

const updateHomeUi = async (req, res, next) => {
  try {
    const { title, release_date, aquisition_method, store_banner } = req.body;

    if (
      typeof title !== 'string' ||
      typeof release_date !== 'string' ||
      typeof aquisition_method !== 'string' ||
      (store_banner !== undefined && store_banner !== null && typeof store_banner !== 'string')
    ) {
      return res.status(400).json({
        message: 'Invalid input data.'
      });
    }

    const result = await pool.query(
      `UPDATE home_ui
      SET title = $1, release_date = $2, aquisition_method = $3, store_banner = $4
      WHERE id = $5`,
      [title, release_date, aquisition_method, store_banner ?? null, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Home UI entry not found.'
      });
    }

    res.status(200).json({
      message: 'Home UI entry updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

const deleteHomeUi = async (req, res, next) => {
  try {
    const result = await pool.query(
      `DELETE FROM home_ui WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Home UI entry not found.'
      });
    }

    res.status(200).json({
      message: 'Home UI entry deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}



module.exports = {
  getAllHomeUi,
  getHomeUiById,
  createHomeUi,
  updateHomeUi,
  deleteHomeUi
};