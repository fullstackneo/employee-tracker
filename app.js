const inquirer = require('inquirer');
const db = require('./db/connection.js');

const promptStart = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'to-do',
      message: 'What would you like to do?',
      choices: ['1.View all departments', '2.View all roles', '3.View all employees', '4.Add a department', '5.Add a role', '6.Add a employee', '7.Update an employee role'],
    },
  ]);
};

const viewDepartments = () => {
  const sql = `SELECT departments.id as department_id, departments.name AS department FROM departments`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log('err:' + err.message);
    }
    console.table(result);
  });
};

const viewRoles = () => {
  const sql = `SELECT roles.title, roles.id AS role_id,roles.salary,departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id=departments.id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log('err:' + err.message);
    }
    console.table(result);
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
    managers.name AS manager
FROM
    employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN managers ON employees.manager_id = managers.id
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    console.table(result);
  });
};

const addDepartment = () => {
  inquirer
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

      db.query(sql, department, (err, result) => {
        if (err) {
          console.log(err.message);
        } else if (result.affectedRows === 1) {
          console.log(`Added ${department} to database!`);
        } else {
          console.log(`Failed to add to database`);
        }
      });
    });
};

const addRole = () => {
  db.query(`SELECT departments.name FROM departments`, (err, result) => {
    let departmentList = result.map(el => el.name);
    inquirer
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
            // 判断数字类型方法

            if (!isNaN(Number(input))) {
              return true;
            } else {
              console.log('Please enter salary!');
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
        const sql = `INSERT IGNORE INTO roles(title,salary,department_id) VALUES (?,?,?)`;
        const department_id = departmentList.indexOf(department) + 1;
        db.query(sql, [role, salary, department_id], (err, result) => {
          if (err) {
            console.log('err:' + err.message);
          } else if (result.affectedRows === 1) {
            console.log(`Added ${role} to database!`);
          } else {
            console.log(`Failed to add to database`);
          }
        });
      });
  });
};

const addEmployee = () => {
  db.query(`SELECT employees.first_name, employees.last_name FROM employees`, (err, result) => {
    let employeeList = result.map(el => el.first_name + ' ' + el.last_name);
    db.query(`SELECT roles.title FROM roles`, (err, result) => {
      let roleList = result.map(el => el.title);
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'The first_name of the employee:',
            validate: input => {
              if (input) {
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
              if (!isNaN(Number(input))) {
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
          const sql = `INSERT INTO employees(first_name,last_name,role_id,manager) VALUES (?,?,?,?)`;
          const role_id = roleList.indexOf(role) + 1;
          db.query(sql, [first_name, last_name, role_id, manager], (err, result) => {
            if (err) {
              console.log('err:' + err.message);
            } else if (result.affectedRows === 1) {
              console.log(`Added ${first_name} ${last_name} to database!`);
            }
          });
        });
    });
  });
};

const updateRole = () => {
  db.query(`SELECT employees.first_name, employees.last_name FROM employees`, (err, result) => {
    let employeeList = result.map((el, index) => index + 1 + '.' + el.first_name + ' ' + el.last_name);
    console.log(employeeList);

    db.query(`SELECT roles.title FROM roles`, (err, result) => {
      let roleList = result.map(el => el.title);
      inquirer
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
          const sql = `Update employees set role_id=? WHERE id=?`;
          const employee_id = employeeList.indexOf(employee)+1;
          const role_id = roleList.indexOf(role) + 1;
     
          console.log([role_id, employee_id]);
          
          db.query(sql, [role_id, employee_id], (err, result) => {
            if (err) {
              console.log('err:' + err.message);
            } else if (result.affectedRows === 1) {
              console.log(`Updated ${employee.split('.')[1]}'s role to ${roleList[role_id-1]}!`);
            }
          });
        });
    });
  });
};

promptStart().then(result => {
  switch (result['to-do'].split('.')[0]) {
    case '1':
      viewDepartments();
      break;
    case '2':
      viewRoles();
      break;
    case '3':
      viewEmployees();
      break;
    case '4':
      addDepartment();
      break;
    case '5':
      addRole();
      break;
    case '6':
      addEmployee();
      break;
    case '7':
      updateRole();
      break;
  }
});
