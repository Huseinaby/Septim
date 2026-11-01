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


module.exports = {
  getAllHomeUi
};