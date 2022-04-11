const inquirer = require('inquirer');
const Role = require('../lib/Role');
const Department = require('../lib/Department');

const viewRoles = async () => {
  await Role.printRoles();
};

const addRole = async () => {
  const departmentList = await Department.getList();
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
    .then(({ role, salary, department }) => Role.add(role, salary, department));
};

const removeRole = async () => {
  const roleList = await Role.getList();
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role do you want to remove?',
        choices: roleList,
      },
    ])
    .then(({ role }) => Role.remove(role));
};

module.exports = {
  viewRoles,
  addRole,
  removeRole,
};
