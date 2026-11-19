import db from "../config/db.js"

const isValid = ({ name, email, role } = {}) =>
    [name, email, role].every((v) => typeof v === "string" && v.trim());

const handleError = (err, res, message) => {
    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message });
};

export const getEmployees = (req, res) => {

    const sql = "SELECT * FROM employees ORDER BY created_at DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error fetching employees"
            });
        }

        res.status(200).json(result);

    });

};

export const addEmployee = (req, res) => {

    if (!isValid(req.body)) {
        return res.status(400).json({
            message: "name, email and role are required"
        });
    }

    const { name, email, role } = req.body;

    const sql = `
        INSERT INTO employees (name, email, role)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name.trim(), email.trim(), role.trim()], (err, result) => {

        if (err) {
            return handleError(err, res, "Error adding employee");
        }

        res.status(201).json({
            message: "Employee added successfully",
            employeeId: result.insertId
        });

    });

};

export const updateEmployee = (req, res) => {

    const { id } = req.params;

    if (!isValid(req.body)) {
        return res.status(400).json({
            message: "name, email and role are required"
        });
    }

    const { name, email, role } = req.body;

    const sql = `
        UPDATE employees
        SET name = ?, email = ?, role = ?
        WHERE id = ?
    `;

    db.query(sql, [name.trim(), email.trim(), role.trim(), id], (err, result) => {

        if (err) {
            return handleError(err, res, "Error updating employee");
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully"
        });

    });

};

export const deleteEmployee = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error deleting employee"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });

    });

};