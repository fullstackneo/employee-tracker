SELECT
    count(roles.salary),
    roles.salary
FROM
    employees
    LEFT JOIN roles ON employees.role_id = roles.id
WHERE
    role_id IS NOT NULL
GROUP BY
    salary