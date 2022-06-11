INSERT INTO department (name)
VALUES ('Finance'), ('HR'), ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Financial Analyst', '60000', '1'), ('Finance Manager', '120000', '1'), 
    ('Recruiter', '58000', '2'), ('HR Manager', '110000', '2'), 
    ('Software Engineer', '70000', '3'), ('Engineering Manager', '130000', '2');

INSERT INTO employee (fist_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Bradley', '2', NULL), ('Joe', 'Gatto', '1', '1'), 
    ('Barbara', 'Ann', '6', NULL), ('Kipp', 'Rippley', '5', '3'), 
    ('Snoop', 'Dog', '4', NULL), ('Jay', 'Z', '3', '5');