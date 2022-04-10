INSERT IGNORE INTO
    departments(name)
VALUES
    ('sales'),
    ('develop'),
    ('engineering');

INSERT IGNORE INTO
    roles(title, salary, department_id)
VALUES
    ('accountant', '10000', '1'),
    ('engineer', '12000', '2'),
    ('salesman', '10000', '3');

INSERT INTO
    employees(first_name, last_name, role_id)
VALUES
    ('neo1', 'lili', '1'),
    ('neo2', 'lili', '2'),
    ('neo3', 'lili', '3'),
    ('neo4', 'lili', '1'),
    ('neo5', 'lili', '3');
