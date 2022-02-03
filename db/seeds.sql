INSERT INTO departments (department_name)
VALUES
("Sales"),
("Engineering"),
("Legal"),
("Planetary Defense");

INSERT INTO roles (role_name, salary, department_id)
VALUES
("Sales Lead", 80000, 1),
("Salesperson", 60000, 1),
("Sr Engineer", 130000, 2),
("Jr Engineer", 50000, 2),
("Legal Team Lead", 160000, 3),
("Lawyer", 100000, 3),
("Space Force Commander", 250000, 4),
("Astronomer", 105000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Dwight", "Schrute", 1, null),
("Jim", "Halpert", 2, 1),
("Pam", "Beasly", 2, 1),
("Louis", "Coleman", 3, null),
("Joe", "Rehfuss", 4, 4),
("Henry", "Weigand", 4, 4),
("Ruth", "Bader-Ginsburg", 5, null),
("Bryan", "Stevenson", 6, 7),
("Steve", "Carrell", 7, null),
("Carl", "Sagan", 8, 9),
("Neil", "DeGrasse-Tyson", 8, 9);