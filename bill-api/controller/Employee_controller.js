const Employee = require('../models/Employee_model');

// Utility function to generate employee ID
const generateEmpId = async () => {
    const lastEmployee = await Employee.findOne({}).sort({ _id: -1 }).exec();
    if (!lastEmployee) {
        return 'DBEMP001';
    }
    const lastId = lastEmployee.emp_id;
    const idNumber = parseInt(lastId.replace('DBEMP', '')) + 1;
    const newId = 'DBEMP' + idNumber.toString().padStart(3, '0');
    return newId;
};

// Add new employee
const EmployeeData = async (req, res) => {
    const { emp_name, emp_address, emp_phone, email, department, designation, joining_date, salary, bank_name, bank_account } = req.body;

    if (emp_name && emp_phone && email && joining_date && salary) {
        try {
            const emp_id = await generateEmpId();

            const NewEmp = new Employee({
                emp_id,
                emp_name,
                emp_address,
                emp_phone,
                email,
                department,
                designation,
                joining_date,
                salary,
                bank_name,
                bank_account
            });

            console.log("New Employee", NewEmp);

            await NewEmp.save();
            return res.status(200).json({
                err: false,
                message: "Employee added successfully",
                data: [NewEmp]
            });

        } catch (error) {
            console.error("Error adding employee:", error);
            return res.status(500).json({
                error: true,
                message: "Internal server error"
            });
        }
    } else {
        return res.status(400).json({
            error: true,
            message: "Missing required fields",
            data: []
        });
    }
};

// Get all employee data
const GetEmployee = async (req, res) => {
    try {
        const getemployeedata = await Employee.find({ is_deleted: { $ne: 1 } });
        return res.status(200).json({
            error: false,
            data: getemployeedata
        });

    } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: []
        });
    }
};

// Get specific employee data by _id
const GetEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                error: true,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            error: false,
            data: employee
        });

    } catch (error) {
        console.error("Error fetching employee:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

// Update employee data
const UpdateEmpData = async (req, res) => {
    const { id } = req.params;
    const { emp_id, emp_name, emp_address, emp_phone, email, department, designation, joining_date, salary, bank_name, bank_account } = req.body;

    if (!id || !id.trim() || !emp_id || !emp_id.trim()) {
        return res.status(400).json({
            error: true,
            message: "Missing required fields"
        });
    }

    try {
        const updatedEmp = await Employee.findByIdAndUpdate(id, {
            emp_id,
            emp_name,
            emp_address,
            emp_phone,
            email,
            department,
            designation,
            joining_date,
            salary,
            bank_name,
            bank_account
        }, { new: true });

        if (!updatedEmp) {
            return res.status(404).json({
                error: true,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Employee updated successfully",
            data: [updatedEmp]
        });

    } catch (error) {
        console.error("Error updating employee:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

// Delete employee
const DeleteEmp = async (req, res) => {
    const { id } = req.params;

    if (!id || !id.trim()) {
        return res.status(400).json({
            error: true,
            message: "Missing required fields"
        });
    }

    try {
        const deletedEmp = await Employee.findByIdAndUpdate(id, { is_deleted: 1 }, { new: true });

        if (!deletedEmp) {
            return res.status(404).json({
                error: true,
                message: "Employee not found"
            });
        }

       
        return res.status(200).json({
            error: false,
            message: "Employee deleted successfully",
            data: [deletedEmp]
        });

    } catch (error) {
        console.error("Error deleting employee:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

module.exports = { EmployeeData, GetEmployee, GetEmployeeById, UpdateEmpData, DeleteEmp };