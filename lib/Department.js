const db = require('../db/connection');

module.exports = class Department {
  constructor(name) {
    this.name = name;
  }

  static async getList() {
    const [result] = await db.promise().execute(`SELECT departments.name FROM departments ORDER BY id`);
    const departmentList = result.map(el => el.name);
    return departmentList;
  }

  static printList() {
    const sql = `
          SELECT
            departments.id AS department_id,
            departments.name AS department
          FROM
            departments
          ORDER BY
            id`;
    return db
      .promise()
      .execute(sql)
      .then(([rows, fields]) => {
        console.table(rows);
      });
  }

  // return the total budget
  static async totalBudget() {
    const [salaryRows] = await db.promise().execute({
      sql: `
    SELECT
      count(roles.salary),
      roles.salary
    FROM
     employees
    LEFT JOIN 
      roles 
    ON 
      employees.role_id = roles.id
    WHERE
      role_id IS NOT NULL
    GROUP BY
      salary    
    `,
      rowsAsArray: true,
    });
    let salaryList = salaryRows.map(el => el[0] * el[1]);
    let totalBudget = 0;
    salaryList.forEach(el => (totalBudget += el));
    return totalBudget;
  }

  // add a new department
  static add(department_name) {
    const sql = `INSERT IGNORE INTO departments(name) VALUES (?)`;
    return db
      .promise()
      .execute(sql, [department_name])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log('Added new department to database!');
        }
      });
  }

  // remove a department
  static remove(department) {
    const sql = `DELETE FROM departments WHERE name=?`;
    return db
      .promise()
      .execute(sql, [department])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log(`Removed ${department} from database!`);
        }
      });
  }
};
