const inquirer = require('inquirer');
const { viewDepartments, addDepartment, removeDepartment, totalBudget } = require('./utils/department');
const { viewRoles, addRole, removeRole } = require('./utils/role');
const { viewEmployees, addEmployee, updateRole, viewByDepartment, viewByManager, removeEmployee, updateManager } = require('./utils/employee');

const executeChoice = choice => {
  switch (choice['to-do'].split('.')[0]) {
    case '1':
      return viewDepartments();
    case '2':
      return viewRoles();
    case '3':
      return viewEmployees();
    case '4':
      return addDepartment();
    case '5':
      return addRole();
    case '6':
      return addEmployee();
    case '7':
      return updateRole();
    case '8':
      process.exit();
  }
};

const start = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'to-do',
        message: 'What would you like to do?',
        choices: ['1.View all departments', '2.View all roles', '3.View all employees', '4.Add a department', '5.Add a role', '6.Add a employee', '7.Update an employee role', '8.exit'],
      },
    ])
    .then(executeChoice)
    .then(start);
};

start();
