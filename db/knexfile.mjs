// Update with your config settings.
// import { Knex } from 'knex';
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {

  // development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: `${process.env.DB_PASSWORD}`,
      database: 'face-rec-app-1-db',
    },
    migrations: {
      directory: './migrations',
      extension: 'mjs', // Default extension for migration
      stub: './stubs/migration_stub.mjs', // Default stub for migrations
    },
    seeds: {
      directory: './seeds',
    },
    useNullAsDefault: true,
  // },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};

export default config;