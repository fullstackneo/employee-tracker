DROP TABLE IF EXISTS employees;

DROP TABLE IF EXISTS roles;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE
    SET
        NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER DEFAULT NULL,
    FOREIGN key(role_id) REFERENCES roles(id) ON DELETE
    SET
        NULL
);

INSERT INTO
    departments(name)
VALUES
    ('sales'),
    ('develop'),
    ('engineering');

INSERT INTO
    roles(title, salary, department_id)
VALUES
    ('manager', '10000', '3'),
    ('engineer', '12000', '2'),
    ('saleman', '10000', '1');

INSERT INTO
    employees(first_name, last_name, role_id)
VALUES
    ('neo1', 'lili', '1'),
    ('neo2', 'lili', '2'),
    ('neo3', 'lili', '3'),
    ('neo4', 'lili', '1'),
    ('neo5', 'lili', '3'),
    ('neo6', 'lili', '2'),
    ('neo7', 'lili', '3'),
    ('neo8', 'lili', '1'),
    ('neo9', 'lili', '1'),
    ('neo10', 'lili', '3'),
    ('neo11', 'lili', '1');