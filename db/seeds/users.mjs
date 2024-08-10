export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {id: 2, name: 'jane', email: 'ytrkptl.ndmlr@gmail.com', entries: 0, pet: 'nopet', age: 16, handle: 'ytrkptl.ndmlr', joined: '2021-08-01'},
  ]);
};

// seeds/20231010120000_users.js
// exports.seed = async function(knex) {
//     // Deletes ALL existing entries
//   // await knex('users').del();

//   // Inserts seed entries
//   await knex('users').insert([
//     {id: 2, name: 'jane', email: 'ytrkptl.ndmlr@gmail.com', entries: 0, pet: 'nopet', age: 16, handle: 'ytrkptl.ndmlr', joined: '2021-08-01'},
//   ]);
// };