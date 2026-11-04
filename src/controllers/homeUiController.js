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

    const allowedFields = [
      'title',
      'release_date',
      'aquisition_method',
      'store_banner'
    ];

    const entries = Object.entries(req.body);

    // Tolak body kosong atau field yang tidak dikenal
    if (
      entries.length === 0 ||
      entries.some(([key]) => !allowedFields.includes(key))
    ) {
      return res.status(400).json({
        message: 'Invalid input data.'
      });
    }

    // Validasi title
    if (
      title !== undefined &&
      (typeof title !== 'string' || !title.trim())
    ) {
      return res.status(400).json({
        message: 'Invalid title.'
      });
    }

    // Validasi release_date
    if (release_date !== undefined) {
      if (
        typeof release_date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(release_date)
      ) {
        return res.status(400).json({
          message: 'Invalid release date format.'
        });
      }

      const date = new Date(`${release_date}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== release_date
      ) {
        return res.status(400).json({
          message: 'Invalid release date.'
        });
      }
    }

    // Validasi aquisition_method
    if (
      aquisition_method !== undefined &&
      (typeof aquisition_method !== 'string' ||
        !aquisition_method.trim())
    ) {
      return res.status(400).json({
        message: 'Invalid aquisition method.'
      });
    }

    // Validasi store_banner (nullable)
    if (
      store_banner !== undefined &&
      store_banner !== null &&
      typeof store_banner !== 'string'
    ) {
      return res.status(400).json({
        message: 'Invalid store banner.'
      });
    }

    const fields = [];
    const values = [];

    const columnMapping = {
      title: title,
      release_date: release_date,
      aquisition_method: aquisition_method,
      store_banner: store_banner
    };

    for (const [key, value] of entries) {
      const column = key;
      let newValue = value;

      if (
        key === 'title' ||
        key === 'aquisition_method'
      ) {
        newValue = value.trim();
      }

      values.push(newValue);
      fields.push(`${column} = $${values.length}`);
    }

    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE home_ui
       SET ${fields.join(', ')}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Home UI entry not found.'
      });
    }

    return res.status(200).json({
      message: 'Home UI entry updated successfully.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};


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