/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('home_ui', {
    id: 'id',
    title: {
      type: 'varchar(100)',
      notNull: true,
      unique: true
    },

    release_date: {
      type: 'date',
      notNull: true
    },

    aquisition_method: {
      type: 'varchar(100)',
      notNull: true
    },

    store_banner: {
      type: 'varchar(100)',
      notNull: false
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('home_ui');
};
