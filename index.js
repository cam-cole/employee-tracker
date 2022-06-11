const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const res = require('express/lib/response');

function App() {

};

App.prototype.initializeApp = function() {
    inquirer
        .prompt({
            type: 'list',
            name: 'start',
            message: 'Welcome to Employee Tracker! What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Exit the app']
        })
        .then(({ start }) => {
            if (start === 'View All Departments') {
                return this.viewAllDepartments();
            }
            else if (start === 'View All Roles') {
                return this.viewAllRoles();
            }
            else if (start === 'View All Employees') {
                return this.viewAllEmployees();
            }
            else if (start === 'Add a department') {
                return this.addDepartment();
            }
            else if (start === 'Add a role') {
                return this.addRole();
            }
            else if (start === 'Add an employee') {
                return this.addEmployee();
            }
            else if (start === 'Update employee role') {
                return this.updateRole();
            }
            else if (start === 'Exit the app') {
                return this.exitApp();
            }
        })
}

App.prototype.viewAllDepartments = function() {
    let sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        console.table(rows);
    })
}

App.prototype.viewAllRoles = function() {
    let sql = `SELECT role.id, role.title, role.salary, department.name AS department
               FROM role
               LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        console.table(rows);
    })
}

App.prototype.viewAllEmployees = function() {
    let sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        console.table(rows);
    })
}

App.prototype.addDepartment = function() {
    inquirer
        .prompt({
            type: 'text',
            name: 'departmentName',
            message: 'What is the name of the department?'
        })
        .then(({ departmentName }) => {
            let sql = `INSERT INTO department (name)
                       VALUES (?)`;
            let params = departmentName;

            db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                console.log(`Added ${departmentName} to the database`)
            })
        })
}

App.prototype.addRole = function() {
    inquirer
        .prompt([{
            type: 'text',
            name: 'roleName',
            message: 'What is the name of the role?'
        },
        {
            type: 'text',
            name: 'roleSalary',
            message: 'What is the salary for the role?'
        },
        {
            type: 'text',
            name: 'roleDeparment',
            message: 'What department does the role belong to?',
        }])
        .then(({ departmentName }) => {
            let sql = `INSERT INTO department (name)
                       VALUES (?)`;
            let params = departmentName;

            db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                console.log(`Added ${departmentName} to the database`)
            })
        })
}



App.prototype.exitApp = function() {
    console.log('You have successfully exited the application!');
}

module.exports = App;