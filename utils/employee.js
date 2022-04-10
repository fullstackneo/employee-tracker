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

const viewByDepartment = async () => {
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
  WHERE
    departments.name = ?
  `;

  const [departmentRows] = await db.promise().execute({
    sql: `
    SELECT
      departments.name
    FROM
      departments
    ORDER BY
      id
    `,
    rowsAsArray: true,
  });
  departmentList = departmentRows.map(el => el[0]);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to choose?',
        choices: departmentList,
      },
    ])
    .then(({ department }) =>
      db
        .promise()
        .execute(sql, [department])
        .then(([rows, fields]) => {
          console.table(rows);
        })
    );
};

const viewByManager = async () => {
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
  WHERE
    employees.manager = ?
  `;

  const [managerRows] = await db.promise().execute({
    sql: `
    SELECT
      employees.manager
    FROM
      employees
    WHERE
      manager IS NOT NULL
    GROUP BY
      manager
    `,
    rowsAsArray: true,
  });
  managerList = managerRows.map(el => el[0]);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'manager',
        message: 'Which manager would you like to choose?',
        choices: managerList,
      },
    ])
    .then(({ manager }) =>
      db
        .promise()
        .execute(sql, [manager])
        .then(([rows, fields]) => {
          console.table(rows);
        })
    );
};

const removeEmployee = async () => {
  const [employeeRows] = await db.promise().execute({ sql: `SELECT employees.first_name, employees.last_name ,employees.id FROM employees ORDER BY id`, rowsAsArray: true });
  let employeeList = employeeRows.map(el => `${el[0]} ${el[1]} (ID:${el[2]})`);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: `Which employee do you want to remove?`,
        choices: employeeList,
      },
    ])
    .then(({ employee }) => {
      const employee_id = employee.split(':')[1].replace(')', '');
      const sql = `DELETE FROM employees WHERE id=?`;
      return db
        .promise()
        .execute(sql, [employee_id])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log(`Removed ${employee.split('(')[0].trim()} from database!`);
          }
        });
    });
};

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
  const [employeeRows] = await db.promise().execute({ sql: `SELECT first_name, last_name,id FROM employees ORDER BY id`, rowsAsArray: true });

  let employeeList = employeeRows.map(el => `${el[0]} ${el[1]} (ID:${el[2]})`);

  const [roleRows] = await db.promise().execute(`SELECT roles.title FROM roles ORDER BY id`);
  let roleList = roleRows.map(el => el.title);

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
    .then(async ({ employee, role }) => {
      const employee_id = employee.split(':')[1].replace(')', '');
      const [[{ id: role_id }]] = await db.promise().execute(`SELECT id FROM roles WHERE title=?`, [role]);
      const sql = `Update employees SET role_id=? WHERE id=?`;
      return db
        .promise()
        .execute(sql, [role_id, employee_id])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log(`Updated ${employee}'s role to ${role}!`);
          }
        });
    });
};

const updateManager = async () => {
  const [employeeRows] = await db.promise().execute({ sql: `SELECT first_name, last_name,id FROM employees ORDER BY id`, rowsAsArray: true });
  let employeeList = employeeRows.map(el => `${el[0]} ${el[1]} (ID:${el[2]})`);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: `Which employee's manager do you want to update?`,
        choices: employeeList,
      },
      {
        type: 'list',
        name: 'manager',
        message: `Which employee do you want to assign as the manager?`,
        choices: employeeList,
      },
    ])
    .then(async ({ employee, manager }) => {
      const employee_id = employee.split(':')[1].replace(')', '');
      const employee_name = employee.split('(')[0].trim();
      const manager_name = manager.split('(')[0].trim();
      const sql = `Update employees SET manager=? WHERE id=?`;
      return db
        .promise()
        .execute(sql, [manager_name, employee_id])
        .then(([result]) => {
          if (result.affectedRows === 1) {
            console.log(`Updated ${employee_name}'s manager to ${manager_name} !`);
          }
        });
    });
};

updateManager();
module.exports = {
  viewEmployees,
  viewByDepartment,
  viewByManager,
  addEmployee,
  updateManager,
  updateRole,
  removeEmployee,
};
