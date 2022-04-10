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
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

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
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

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
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    });
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
      const sql = `INSERT IGNORE INTO departments(name) VALUES ('${department}')`;
      return db
        .promise()
        .query(sql)
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new department to database!');
          }
        });
    });
};

const addRole = async () => {
  const [rows] = await db.promise().query(`SELECT departments.name FROM departments ORDER BY id`);
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
      const sql = `INSERT IGNORE INTO roles(title,salary,department_id) VALUES ('${role}','${salary}','${department_id}')`;
      return db
        .promise()
        .query(sql)
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new role to database!');
          }
        });
    });
};

const addEmployee = async () => {
  const [employeeRows] = await db.promise().query(`SELECT employees.first_name, employees.last_name FROM employees ORDER BY id`);
  let employeeList = employeeRows.map(el => el.first_name + ' ' + el.last_name);
  const [roleRows] = await db.promise().query(`SELECT roles.title FROM roles ORDER BY id`);
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
        message: `Which is the employee's role?`,
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
      const sql = `INSERT INTO employees(first_name,last_name,role_id,manager) VALUES ('${first_name}','${last_name}','${role_id}','${manager}')`;
      return db
        .promise()
        .query(sql)
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log('Added new employee to database!');
          }
        });
    });
};

const updateRole = async () => {
  const [employeeRows] = await db.promise().query(`SELECT employees.first_name, employees.last_name FROM employees ORDER BY id`);
  let employeeList = employeeRows.map((el, index) => index + 1 + '.' + el.first_name + ' ' + el.last_name);
  console.log(employeeList);
  const [roleRows] = await db.promise().query(`SELECT roles.title FROM roles ORDER BY id`);
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
      const sql = `Update employees set role_id='${role_id}' WHERE id=${employee_id}`;
      return db
        .promise()
        .query(sql)
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log(`Updated ${employee}'s role to ${role}!`);
          }
        });
    });
};

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateRole,
};
