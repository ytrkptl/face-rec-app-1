import knex from "knex";
import dotenv from "dotenv"
import knexConfig from "./knexfile.mjs";
import logger from "../utils/winston-logger.mjs";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const db = knex(knexConfig);

const connectDB = async () => {  
  try {
    // query the database to test connection
    const result = await db.schema.hasTable("users");
    if(!result) {
      logger.info("'users' table does not exist");
    } else {
      logger.info("'users' table exists");
    }
    logger.info("Database connection successful");
    //await db.schema.createTable("users", (table) => {
      //t.increments("id").primary();
      //t.string("name", 100).notNullable();
      //t.text("email", 100).unique().notNullable();
      //t.integer("entries").defaultTo(0);
      //t.string("pet");
      //t.integer("age");
      //t.string("handle", 255);
    //});
  } catch (error) {
    console.log(error)
    // Handle connection error
    console.error("Error connecting to the database:", error);
    // Exit process with failure
    process.exit(1);
  }
  return db;
};

export { db, connectDB };
