const inquirer = require('inquirer');
const Department = require('../lib/Department');
const Role = require('../lib/Role');
const Employee = require('../lib/Employee');


const viewEmployees = async () => {
  await Employee.printEmployee();
};

const viewByDepartment = async () => {
  departmentList = await Department.getList();
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to choose?',
        choices: departmentList,
      },
    ])
    .then(({ department }) => Employee.printByDepartment(department));
};

const viewByManager = async () => {
  const managerList = await Employee.getManagerList();
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'manager',
        message: 'Which manager would you like to choose?',
        choices: managerList,
      },
    ])
    .then(({ manager }) => Employee.sortByManager(manager));
};

const removeEmployee = async () => {
  const employeeList = await Employee.getList('id');

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: `Which employee do you want to remove?`,
        choices: employeeList,
      },
    ])
    .then(async ({ employee }) => {
      const employee_id = employee.split(':')[1].replace(')', '');
      await Employee.removeById(employee_id);
    });
};

const addEmployee = async () => {
  const roleList = await Role.getList();
  const employeeList = await Employee.getList('name');
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
    .then(async ({ first_name, last_name, role, manager }) => {
      const role_id = await Role.getId(role);
      await Employee.addEmployee(first_name, last_name, role_id, manager);
    });
};

const updateRole = async () => {
  const employeeList = await Employee.getList('id');
  const roleList = await Role.getList();
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
      await Employee.updateRole(employee_id, role);
    });
};

const updateManager = async () => {
  const employeeList = await Employee.getList('id');
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: `Which employee do you want to update?`,
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
      manager = manager.split('(')[0].trim();
      console.log(employee_id);

      await Employee.updateManager(employee_id, manager);
    });
};

module.exports = {
  viewEmployees,
  viewByDepartment,
  viewByManager,
  addEmployee,
  updateManager,
  updateRole,
  removeEmployee,
};
