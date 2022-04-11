INSERT IGNORE INTO departments(name)
VALUES
    ('sales'),
    ('develop'),
    ('engineering');

INSERT IGNORE INTO roles(name, salary, department_id)
VALUES
    ('accountant', 10000, 1),
    ('engineer', 12000, 3),
    ('salesman', 10000, 1),
    ('programmer', 12000, 2);

INSERT INTO
    employees(first_name, last_name, role_id, manager)
VALUES
    ('neo1', 'lili', '1', NULL),
    ('neo2', 'lili', '3', 'neo1 lili'),
    ('neo3', 'lili', '4', 'neo1 lili'),
    ('neo4', 'lili', '2', 'neo1 lili'),
    ('neo5', 'lili', '3', 'neo1 lili'),
    ('neo6', 'lili', '2', 'neo5 lili'),
    ('neo7', 'lili', '4', 'neo5 lili'),
    ('neo8', 'lili', '4', 'neo6 lili'),
    ('neo9', 'lili', '2', 'neo6 lili'),
    ('neo10', 'lili', '3', NULL);