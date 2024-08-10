PRAGMA foreign_keys = OFF;
-- Drop all tables
DROP TABLE IF EXISTS knex_migrations;
DROP TABLE IF EXISTS knex_migrations_lock;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;