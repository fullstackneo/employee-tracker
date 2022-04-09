module.exports = class Employee {
  constructor(first_name, last_name, role, department, salary, manager) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
    this.department = department;
    this.salary = salary;
    this.manager = manager;
  }
};
