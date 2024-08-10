/**
 * filename: knexfile.js
 * Let knex find the configuration by providing named exports,
 * but if exported a default, it will take precedence, and it will be used instead
 **/
const config = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  migrations: {
    directory: './migrations',
    extension: 'mjs', // Default extension for migration
    stub: './stubs/migration_stub.mjs' // Default stub for migrations
  },
  seeds: {
    directory: './seeds',
  },
  useNullAsDefault: true,
};

// console.log(config)

export const { client, connection, useNullAsDefault, migrations, seeds } = config;
