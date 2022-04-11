const db = require('../db/connection');

class Employee {
  constructor(first_name, last_name, role_id, manager) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager = manager;
  }

  // get the list of employee
  static async getList(filter) {
    const [result] = await db.promise().execute(`SELECT * FROM employees ORDER BY id`);
    switch (filter) {
      case 'name':
        const listWithId = result.map(el => el.first_name + ' ' + el.last_name);
        return listWithId;
      case 'id':
        const nameList = result.map(el => `${el.first_name} ${el.last_name} (ID:${el.id})`);
        return nameList;
    }
  }

  // console.log all the employees
  static printEmployee() {
    const sql = `
  SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.name,
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
  }

  // return the list of manager
  static async getManagerList() {
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
    return managerRows.map(el => el[0]);
  }

  // console.log employees by department
  static async printByDepartment(department) {
    const sql = `
  SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.name,
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

    return db
      .promise()
      .execute(sql, [department])
      .then(([rows, fields]) => {
        console.table(rows);
      });
  }

  // console.log all the employees by manager
  static async printByManager(manager) {
    const sql = `
  SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.name,
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

    return db
      .promise()
      .execute(sql, [manager])
      .then(([rows, fields]) => {
        console.table(rows);
      });
  }

  // remove an employee
  static async removeById(id) {
    const sql = `DELETE FROM employees WHERE id=?`;
    return db
      .promise()
      .execute(sql, [id])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log(`Removed from database!`);
        }
      });
  }

  // add a new employee
  static async addEmployee(employeeObj) {
    const sql = `INSERT INTO employees(first_name,last_name,role_id,manager) VALUES (?,?,?,?)`;
    return db
      .promise()
      .execute(sql, Object.values(employeeObj))
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log('Added new employee to database!');
        }
      });
  }

  // update an employee's role
  static async updateRole(id, role) {
    const [[{ id: role_id }]] = await db.promise().execute(`SELECT id FROM roles WHERE name=?`, [role]);
    const sql = `Update employees SET role_id=? WHERE id=?`;
    return db
      .promise()
      .execute(sql, [role_id, id])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log(`Updated role to ${role}!`);
        }
      });
  }

  // update an employee's manager
  static async updateManager(id, manager) {
    const sql = `Update employees SET manager=? WHERE id=?`;
    return db
      .promise()
      .execute(sql, [manager, id])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log(`Updated manager!`);
        }
      });
  }
}
module.exports = Employee;
