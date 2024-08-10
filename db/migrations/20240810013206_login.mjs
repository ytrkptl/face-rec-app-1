/**
 * This is a stub migration file. It is used to create the initial migration file
 */

/**
 * Runs the migration up.
 * @param db The database connection
 */
export async function up(db) {
  try {
    // create the users table
    // await db.schema.createTable("users", (table) => {
    //   table.increments("id").primary().comments("The primary key of the table");
    //   table.string("name", 100).notNullable().comments("The name of the user");
    //   table.text("email", 100).unique().notNullable().comments("The email of the user");
    //   table.integer("entries").defaultTo(0).comments("The number of entries");
    //   table.string("pet").comments("The name of the pet of the user");
    //   table.integer("age").comments("The age of the user");
    //   table.string("handle", 255).comments("The twitter handle of the user");
    //   table.dateTime("created_at").defaultTo(knex.fn.now()).comments("The date the user was created");
    // });
    // console.log("users table created");
  } catch (error) {
    console.log(error)
  }
}

/**
 * Runs the migration down.
 * @param db The database connection
 */
export async function down(db) {
  try {
    // drop the tables
    // await db.schema.dropTable("users");
  } catch (error) {
    console.log(error)
  }
}

