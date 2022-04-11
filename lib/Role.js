const db = require('../db/connection');

module.exports = class Role {
  // return the list of roles 
  static async getList() {
    const [rows] = await db.promise().execute(`SELECT roles.name FROM roles ORDER BY id`);
    const roleList = rows.map(el => el.name);
    return roleList;
  }

  // return the id of a role 
  static async getId(role) {
    const [result] = await db.promise().execute(`SELECT id FROM roles WHERE name=?`, [role]);
    const id = result[0].id;
    return id;
  }

  // console.log all the roles
  static async printRoles() {
    const sql = `
  SELECT
    roles.name,
    roles.id AS role_id,
    roles.salary,
    departments.name AS department
  FROM
    roles
  LEFT JOIN
    departments ON roles.department_id = departments.id`;

    return db
      .promise()
      .execute(sql)
      .then(([rows, fields]) => {
        console.table(rows);
      });
  }

  // add a new role 
  static async add(role, salary, department) {
    const [result] = await db.promise().execute(`SELECT id FROM departments WHERE name=?`, [department]);
    const department_id = result[0].id;

    const sql = `INSERT IGNORE INTO roles(name,salary,department_id) VALUES (?,?,?)`;
    return db
      .promise()
      .execute(sql, [role, salary, department_id])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log(`Added ${role} to database!`);
        }
      });
  }

  // remove a role 
  static async remove(role) {
    const sql = `DELETE FROM roles WHERE name=?`;
    return db
      .promise()
      .execute(sql, [role])
      .then(([result]) => {
        if (result.affectedRows === 1) {
          console.log(`Removed ${role} from database!`);
        }
      });
  }
};
