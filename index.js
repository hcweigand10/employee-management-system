// Include packages needed for this application
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const { dqpb } = require("cli-spinners");
let departments = [];
let roles = [];
let employees = [];

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// empty out and then fill departments array on init
const init = () => {
  departments = [];
  roles = [];
  employees = [];
  db.query("SELECT department_name FROM departments", (err, data) => {
    data.forEach((element) => {
      departments.push(element.department_name);
    });
  });
  db.query("SELECT role_name FROM roles", (err, data) => {
    data.forEach((element) => {
      roles.push(element.role_name);
    });
  });
  db.query("SELECT last_name FROM employees", (err, data) => {
    data.forEach((element) => {
      employees.push(element.last_name);
    });
  });
};

const home = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit",
      ],
    })
    .then((response) => {
      const choice = response.action;
      console.log(choice);
      switch (choice) {
        case "View All Departments":
          db.query("SELECT * FROM departments;", (err, data) => {
            console.table(data);
            home();
          });
          break;
        case "View All Roles":
          db.query(
            "SELECT role_name, roles.id, department_id, salary FROM departments JOIN roles ON roles.department_id = departments.id;",
            (err, data) => {
              console.table(data);
              home();
            }
          );
          break;
        case "View All Employees":
          db.query(
            `SELECT employees.id, employees.first_name, employees.last_name, role_name AS Job_Title, department_name AS Department, salary AS Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager FROM roles JOIN employees ON roles.id = employees.role_id JOIN departments ON departments.id = roles.department_id LEFT JOIN employees AS managers ON managers.id = employees.manager_id;`,
            (err, data) => {
              console.table(data);
              home();
            }
          );
          break;
        case "Add a Department":
          addDept();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployee();
          break;
        case "Quit":
          console.log("Adios!");
          break;
      }
    });
};

// add a department to the db
const addDept = () => {
  inquirer
    .prompt({
      type: "input",
      message: "What is the name of the department?",
      name: "name",
    })
    .then((response) => {
      db.query(
        `INSERT INTO departments (department_name) VALUES ("${response.name}");`
      );
      console.log("Department Added!");
      // update departments array
      init();
      home();
    });
};

// add a role to the db
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "name",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "salary",
      },
      {
        type: "list",
        message: "To which department does the role belong?",
        name: "dept",
        choices: departments,
      },
    ])
    // get ID from department choice then insert into table with all 3 params
    .then((response) => {
      let deptId;
      db.query("SELECT * FROM departments;", (err, data) => {
        data.forEach((element) => {
          if (element.department_name == response.dept) {
            deptId = element.id;
          }
        });
        db.query(
          `INSERT INTO roles (role_name, salary, department_id) VALUES ("${response.name}", ${response.salary}, ${deptId})`
        );
        console.log("Role Added!");
        init();
        home();
      });
    });
};

// add a department to the db
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is their first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is their last name?",
        name: "last_name",
      },
      {
        type: "list",
        message: "What is their role?",
        name: "role",
        choices: roles,
      },
      {
        type: "list",
        message: "Who will they report to?",
        name: "manager",
        choices: employees,
      },
    ])
    .then((response) => {
      let role_id;
      let manager_id;
      db.query("SELECT * FROM roles;", (err, data) => {
        data.forEach((element) => {
          if (element.role_name == response.role) {
            role_id = element.id;
          }
        });
      });
      db.query("SELECT * FROM employees;", (err, data) => {
        data.forEach((element) => {
          if (element.last_name == response.manager) {
            manager_id = element.id;
          }
        });
        db.query(
          `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${response.first_name}', '${response.last_name}', ${role_id}, ${manager_id})`
        );
      });
      console.log("Employee Added!");
      init();
      home();
    });
};

// update employee
const updateEmployee = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Who would you like to update?",
        name: "employee",
        choices: employees,
      },
      {
        type: "list",
        message: "What is their new role?",
        name: "role",
        choices: roles,
      },
      {
        type: "list",
        message: "Who will they now report to?",
        name: "manager",
        choices: employees,
      },
    ])
    .then((response) => {
      let employee_id;
      let role_id;
      let manager_id;
      db.query("SELECT * FROM employees;", (err, data) => {
        data.forEach((element) => {
          if (element.last_name == response.employee) {
            employee_id = element.id;
          }
        });
      });
      db.query("SELECT * FROM roles;", (err, data) => {
        data.forEach((element) => {
          if (element.role_name == response.role) {
            role_id = element.id;
          }
        });
      });
      db.query("SELECT * FROM employees;", (err, data) => {
        data.forEach((element) => {
          if (element.last_name == response.manager) {
            manager_id = element.id;
          }
        });
        db.query(
          `UPDATE employees SET role_id = ${role_id}, manager_id = ${manager_id} WHERE id=13;`
        );
      });
      console.log("Employee Updated!");
      init();
      home();
    });
};

init();
home();
