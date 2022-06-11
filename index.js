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
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        console.table(rows);
        return this.initializeApp()
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
        return this.initializeApp()
    })
}

App.prototype.viewAllEmployees = function() {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
               FROM employee
               LEFT JOIN role ON employee.role_id = role.id
               LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        console.table(rows);
        return this.initializeApp()
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
                console.log(`Added ${departmentName} to the database`);
                return this.initializeApp()
            })
        })
}

App.prototype.addRole = function() {
    let sql = `SELECT department.id, department.name
               FROM department;`
    db.promise().query(sql)
    .then(([rows]) => {
        let departments = rows
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }))
    inquirer
        .prompt([{
            type: 'text',
            name: 'title',
            message: 'What is the name of the role?'
        },
        {
            type: 'text',
            name: 'salary',
            message: 'What is the salary for the role?'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'What department does the role belong to?',
            choices: departmentChoices
        }])
        .then(role => {
            let sql = `INSERT INTO role SET ?`
            db.query(sql, role)
            console.log(`Added ${role.title} to the database.`)
            return this.initializeApp()
        })
    }) 
}

App.prototype.addEmployee = function() {
    let sql = `SELECT role.id, role.title
               FROM role`
    db.promise().query(sql)
    .then(([rows]) => {
        let roles = rows
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }))
        let sql = `SELECT employee.id, employee.last_name
                FROM employee
                WHERE manager_id IS NULL`
        db.promise().query(sql)
        .then(([rows]) => {
            let managers = rows
            const managerChoices = managers.map(({ id, last_name }) => ({
                name: last_name,
                value: id
            }))
            inquirer
            .prompt([{
                type: 'text',
                name: 'first_name',
                message: 'What is the first name of the employee?'
            },
            {
                type: 'text',
                name: 'last_name',
                message: 'What is the last name of the employee?'
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'What is the role of the employee?',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is the manager of the employee?',
                choices: managerChoices
            }])
            .then(employee => {
                let sql = `INSERT INTO employee SET ?`;
                db.query(sql, employee)
                console.log('Added employee to database.')
                return this.initializeApp()
            })
        })
        
        }
    )
}

App.prototype.updateRole = function() {
    let sql = `SELECT employee.id, employee.last_name
               FROM employee`
    db.promise().query(sql)
    .then(([rows]) => {
        let employees = rows
        const employeeChoices = employees.map(({ id, last_name })=> ({
            name: last_name,
            value: id
        }))
        let sql = `SELECT role.id, role.title
                   FROM role`
        db.promise().query(sql)
        .then(([rows]) => {
            let roles = rows
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }))
            inquirer
                .prompt([{
                    type: 'list',
                    name: 'last_name',
                    messgage: "Which employee's role do you want to update?",
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's new role?",
                    choices: roleChoices
                }])
                .then(employee => {
                    let sql = `UPDATE employee SET role_id = ?
                               WHERE id = ?`
                    let params = [employee.role_id, employee.last_name]
                    db.query(sql, params)
                    console.log('Employee role updated.')
                    return this.initializeApp()
                })
        })
    })
}



App.prototype.exitApp = function() {
    console.log('You have successfully exited the application!');
}

module.exports = App;