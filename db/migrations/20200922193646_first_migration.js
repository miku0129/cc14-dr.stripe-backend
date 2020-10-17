exports.up = function (knex) {
  return knex.schema
    .createTable("patients", (table) => {
      table.increments("patient_id").primary();
      table.text("first_name");
      table.text("last_name");
    })
    .createTable("visits", (table) => {
      table.increments("visit_id").primary();
      table.integer("patient_id");
      table.timestamp("visit_date");
      table.string("treatment");
      table.text("symptoms");
      table.text("doctor");
      table.boolean("paid");
      table.text("price");
      table.text("hospital_name");
      table.boolean("medicine");

      table.foreign("patient_id").references("patient_id").inTable("patients");
    });
};

// exports.up = function (knex) {
//     return knex.schema
//       .createTable("visits", (table) => {
//         table.increments("visit_id").primary();
//         table.foreign("patient_id").references("patient_id").inTable("patients");
//         table.timestamp("visit_date");
//         table.string("treatment");
//         table.text("symptoms");
//         table.text("doctor");
//         table.boolean("paid");
//         table.text("price");
//         table.text("hospital_name");
//       })
//       .createTable("patients", (table) => {
//         table.increments("patient_id").primary();
//         table.text("first_name");
//         table.text("last_name");
//       });
//   };

exports.down = function (knex) {
  return knex.schema.dropTable("visits").dropTable("patients");
};
