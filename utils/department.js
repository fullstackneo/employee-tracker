const db = require('../db/connection');
const inquirer = require('inquirer');

const viewDepartments = () => {
  const sql = `
          SELECT
            departments.id AS department_id,
            departments.name AS department
          FROM
            departments
          ORDER BY
            id`;
  return db
    .promise()
    .execute(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

const totalBudget = () => {};

const addDepartment = () => {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'The name of a new department:',
        validate: input => {
          if (input) {
            return true;
          } else {
            console.log(`Please enter a department's name!`);
            return false;
          }
        },
      },
    ])
    .then(({ department }) => {
      const sql = `INSERT IGNORE INTO departments(name) VALUES (?)`;
      return db
        .promise()
        .execute(sql,[department])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new department to database!');
          }
        });
    });
};
const removeDepartment = () => {};

module.exports = {
  viewDepartments,
  addDepartment,
};
