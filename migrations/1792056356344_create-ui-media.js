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
  pgm.createTable('ui_media', {
    id: 'id',
    home_ui_id: {
      type: 'integer',
      notNull: true,
      references: 'home_ui',
      onDelete: 'cascade'
    },

    media_type: {
      type: 'varchar(100)',
      notNull: true
    },

    media_url: {
      type: 'varchar(100)',
      notNull: true
    },
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('ui_media');
};
