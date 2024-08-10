# Face-rec-app-1

This is a face recognition app built using React and Express. This root folder includes both client folder and the server files.

## server

The server is built using Express.

## client

The frontend is built using create-react-app.

## Instructions for setting up the POSTGRES db on Heroku

- If you are using Heroku and have added the heroku-postgres add-on to your heroku project

  - from the root of the folder
  - inside the terminal
  - run

    heroku pg:psql

Source: `https://www.taniarascia.com/node-express-postgresql-heroku/`
the link above is just for help but do not follow it verbatim.

-- Make sure you are using the proper column names and such before beginning transaction when writing the sql commands below.

> the block below can be run as-is or directly copy-pasted in the terminal

    BEGIN TRANSACTION;
    CREATE TABLE login (
    id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL
    );
    COMMIT;

> the block below can be run as-is or directly copy-pasted in the terminal

    BEGIN TRANSACTION;
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email text UNIQUE NOT NULL,
        entries INTEGER DEFAULT '0',
        pet VARCHAR(255),
        age INTEGER,
        handle VARCHAR(255),
        joined TIMESTAMP NOT NULL,
    );
    COMMIT;

- Be sure to replace ADMIN_NAME, ADMIN_EMAIL, with their values instead.
- Be sure to replace ADMIN_HASH with a hash generated using a site like <https://bcrypt-generator.com/> . You can use your desired password on that site to generate a hash and store the hash in the database instead of storing the password.
- Use proper date for joined value as well.

> The block below SHOULD NOT be directly run or copy-pasted. First read the note above and replace appropriate values in the commands below. Then run the commands below in the terminal.

    BEGIN TRANSACTION;
    INSERT into admin (name, email, joined) values ('ADMIN_NAME', 'ADMIN_EMAIL', '2019-09-07');
    INSERT into login(hash, email) values ('ADMIN_HASH', 'ADMIN_EMAIL');
    COMMIT;
