INSERT IGNORE INTO departments(name)
VALUES
    ('sales'),
    ('develop'),
    ('engineering');

INSERT IGNORE INTO roles(title, salary, department_id)
VALUES
    ('accountant', '10000', '1'),
    ('engineer', '12000', '2'),
    ('salesman', '10000', '3');

INSERT INTO
    employees(first_name, last_name, role_id, manager)
VALUES
    ('neo1', 'lili', '1', NULL),
    ('neo2', 'lili', '2', 'neo1 lili'),
    ('neo3', 'lili', '3', 'neo1 lili'),
    ('neo4', 'lili', '1', 'neo1 lili'),
    ('neo5', 'lili', '3', 'neo1 lili'),
    ('neo6', 'lili', '3', 'neo5 lili'),
    ('neo7', 'lili', '1', 'neo5 lili'),
    ('neo8', 'lili', '3', 'neo6 lili'),
    ('neo9', 'lili', '3', 'neo6 lili'),
    ('neo10', 'lili', '3', NULL);