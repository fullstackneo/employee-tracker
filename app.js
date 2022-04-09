const inquirer = require('inquirer');
const db = require('../db/connection.js');

const promptStart = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'to-do',
      message: 'What would you like to do?',
      choices: ['1.view all departments', '2.view all roles', '3.add a department', '4.add a role', '5.add a employee', '6.update an employee role'],
    },
  ]);
};

const viewDepartments = () => {
  console.log(1);
  db.query(sql, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    console.log(2);
  });
};

const viewRoles = () => {
  // console.log(2);
};

const addDepartment = () => {};

const addRole = () => {};

const addEmployee = () => {};

const updateRole = () => {};

promptStart().then(result => {
  switch (result['to-do'].split('.')[0]) {
    case '1':
      viewDepartments();
      break;
    case '2':
      viewRoles();
      break;
    case '3':
      addDepartment();
      break;
    case '4':
      addEmployee();
      break;
    case '5':
      addRole();
      break;
    case '6':
      updateRole();
      break;
  }
});
