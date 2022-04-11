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

const totalBudget = async () => {
  const [salaryRows] = await db.promise().execute({
    sql: `
    SELECT
      count(roles.salary),
      roles.salary
    FROM
     employees
    LEFT JOIN 
      roles 
    ON 
      employees.role_id = roles.id
    WHERE
      role_id IS NOT NULL
    GROUP BY
      salary    
    `,
    rowsAsArray: true,
  });
  let salaryList = salaryRows.map(el => el[0] * el[1]);
  let totalBudget = 0;
  salaryList.forEach(el => (totalBudget += el));
  console.log(`Total budget is ${totalBudget}`);
};

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
        .execute(sql, [department])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new department to database!');
          }
        });
    });
};
const removeDepartment = async () => {
  const [rows] = await db.promise().execute(`SELECT departments.name FROM departments ORDER BY id`);
  const departmentList = rows.map(el => el.name);
  const sql = `DELETE FROM departments WHERE name=?`;
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department do you want to remove?',
        choices: departmentList,
      },
    ])
    .then(({ department }) => {
      db.promise()
        .execute(sql, [department])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log(`Removed ${department} from database!`);
          }
        });
    });
};

module.exports = {
  viewDepartments,
  addDepartment,
  removeDepartment,
  totalBudget,
};
