const inquirer = require('inquirer');
const Department = require('../lib/Department');

const viewDepartments = async () => {
  await Department.printList();
};

const totalBudget = async () => {
  const totalBudget = Department.totalBudget();
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
    .then(({ department }) => Department.add(department));
};

const removeDepartment = async () => {
  const departmentList = await Department.getList();
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department do you want to remove?',
        choices: departmentList,
      },
    ])
    .then(({ department }) => Department.remove(department));
};

module.exports = {
  viewDepartments,
  addDepartment,
  removeDepartment,
  totalBudget,
};
