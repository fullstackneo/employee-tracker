const db = require('../db/connection');
const inquirer = require('inquirer');

const viewRoles = () => {
  const sql = `
  SELECT
    roles.title,
    roles.id AS role_id,
    roles.salary,
    departments.name AS department
  FROM
    roles
  LEFT JOIN
    departments ON roles.department_id = departments.id`;

  return db
    .promise()
    .execute(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

const addRole = async () => {
  const [rows] = await db.promise().execute(`SELECT departments.name FROM departments ORDER BY id`);
  const departmentList = rows.map(el => el.name);

  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'role',
        message: 'The name of a new title:',
        validate: input => {
          if (input) {
            return true;
          } else {
            console.log('Please enter a title!');
            return false;
          }
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: 'The salary of this role:',
        validate: input => {
          if (!isNaN(Number(input))) {
            return true;
          } else {
            console.log('Please enter correct salary!');
            return false;
          }
        },
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: departmentList,
      },
    ])
    .then(({ role, salary, department }) => {
      const department_id = departmentList.indexOf(department) + 1;
      const sql = `INSERT IGNORE INTO roles(title,salary,department_id) VALUES (?,?,?)`;
      return db
        .promise()
        .execute(sql, [role, salary, department_id])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new role to database!');
          }
        });
    });
};

const removeRole = () => {};
module.exports = {
  viewRoles,
  addRole,
};
