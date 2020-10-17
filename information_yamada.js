exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("patients")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("patients").insert([
        { first_name: "Jiro", last_name: "Yamada" },
        // {id: 2, colName: 'rowValue2'},
        // {id: 3, colName: 'rowValue3'}
      ]);
    });
};
