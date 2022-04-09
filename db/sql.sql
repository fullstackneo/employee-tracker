SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.title,
    roles.salary,
    departments.name AS department,
    managers.name AS manager
FROM
    employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN managers ON employees.manager_id = managers.id