const db = require('../db/connection');
const inquirer = require('inquirer');

const viewEmployees = () => {
  const sql = `
  SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.title,
    roles.salary,
    departments.name AS department,
    employees.manager
  FROM
    employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
  `;
  return db
    .promise()
    .execute(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

const viewByDepartment = () => {};

const viewByManager = () => {};

const removeEmployee = () => {};

const addEmployee = async () => {
  const [employeeRows] = await db.promise().execute({ sql: `SELECT employees.first_name, employees.last_name FROM employees ORDER BY id`, rowsAsArray: true });
  let employeeList = employeeRows.map(el => el.join(' '));
  const [roleRows] = await db.promise().execute(`SELECT roles.title FROM roles ORDER BY id`);
  let roleList = roleRows.map(el => el.title);
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'The first_name of the employee:',
        validate: input => {
          if (input.trim()) {
            return true;
          } else {
            console.log('Please enter the first_name!');
            return false;
          }
        },
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'The last_name of the employee:',
        validate: input => {
          if (input.trim()) {
            return true;
          } else {
            console.log('Please enter the last_name!');
            return false;
          }
        },
      },
      {
        type: 'list',
        name: 'role',
        message: `What is the employee's role?`,
        choices: roleList,
      },
      {
        type: 'list',
        name: 'manager',
        message: `Who is the employee's manager?`,
        choices: employeeList,
      },
    ])
    .then(({ first_name, last_name, role, manager }) => {
      const role_id = roleList.indexOf(role) + 1;
      console.log(role_id);

      const sql = `INSERT INTO employees(first_name,last_name,role_id,manager) VALUES (?,?,?,?)`;
      return db
        .promise()
        .execute(sql, [first_name, last_name, role_id, manager])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new employee to database!');
          }
        });
    });
};

const updateRole = async () => {
  const [employeeRows] = await db.promise().execute({ sql: `SELECT employees.first_name, employees.last_name FROM employees ORDER BY id`, rowsAsArray: true });
  let employeeList = employeeRows.map(el => el.join(' '));
  const [roleRows] = await db.promise().execute(`SELECT roles.title FROM roles ORDER BY id`);
  let roleList = roleRows.map(el => el.title);
  console.log(roleList);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: `Which employee's role do you want to update?`,
        choices: employeeList,
      },
      {
        type: 'list',
        name: 'role',
        message: `Which role do you want to update for the employee?`,
        choices: roleList,
      },
    ])
    .then(({ employee, role }) => {
      const employee_id = employeeList.indexOf(employee) + 1;
      const role_id = roleList.indexOf(role) + 1;
      const sql = `Update employees set role_id=? WHERE id=?`;
      return db
        .promise()
        .execute(sql,[role_id,employee_id])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log(`Updated ${employee}'s role to ${role}!`);
          }
        });
    });
};

const updateManager = () => {};

module.exports = {
  viewEmployees,
  addEmployee,
  updateRole,
};
