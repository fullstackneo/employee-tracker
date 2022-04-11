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
      return viewByDepartment();
    case '5':
      return viewByManager();
    case '6':
      return addDepartment();
    case '7':
      return addRole();
    case '8':
      return addEmployee();
    case '9':
      return removeDepartment();
    case '10':
      return removeRole();
    case '11':
      return removeEmployee();
    case '12':
      return updateRole();
    case '13':
      return updateManager();
    case '14':
      return totalBudget();
    case '15':
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
        choices: ['1.View all departments', '2.View all roles', '3.View all employees', '4.View employees by department', '5.View employees by manager', '6.Add a department', '7.Add a role', '8.Add an employee', '9.Remove department', '10.Remove role', '11.Remove Employee', `12.Update employee's role`, `13.Update employee's manager`, '14.View total budget', '15.exit'],
      },
    ])
    .then(executeChoice)
    .then(start);
};

start();
