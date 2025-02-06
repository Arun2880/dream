const Task = require('../models/task_model');
const Employee = require('../models/Employee_model'); // Assuming this is the model for employees or clients

// --------------------Add task--------------------

const Addtask = async (req, res) => {
    const { project_title, project_description, assignee, dueDate, Status } = req.body;

    try {
        if (!project_title || !assignee) {
            return res.status(400).json({
                error: true,
                message: "Something went wrong || Some fields are missing"
            });
        }

        const employee = await Employee.findById(assignee);
        if (!employee) {
            return res.status(404).json({
                error: true,
                message: "Assignee not found. Please provide a valid employee ID."
            });
        }

        const Newtask = new Task({
            project_title,
            project_description,
            assignee,
            dueDate,
            Status,
        });

        await Newtask.save();

        // Add task ID to the employee's tasks array and save
        employee.tasks.push(Newtask._id); // Push the task ID to the tasks array
        await employee.save();

        return res.status(200).json({
            error: false,
            message: "Task added successfully and assigned to the employee.",
            data: {
                task: Newtask,
                employee: employee
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${error}`
        });
    }
};

// -----------------------------------get all task-------------------------------

const Getalltask = async (req, res) => {

    try {
        const gettask = await Task.find({ is_delete: { $ne: 1 } });

        return res.status(200).json({
            error: false,
            message: 'All tasks are here',
            data: gettask // No need to wrap in an array
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Internal server error ${error}`
        });
    }
}

// -----------------------------------------------------get specific task----------------------------

const Getsingletask = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                error: true,
                message: "Something went wrong || Missing task id"
            });
        }
        const gettask = await Task.findById(id);
        if (!gettask) {
            return res.status(404).json({
                error: true,
                message: "Task not found."
            });
        }
        return res.status(200).json({
            error: false,
            message: "Task Details",
            data: gettask // No need to wrap in an array
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Internal Server error ${error}`
        });
    }
}

// -----------------------------------------------update task--------------------------------------------------------

const Updatetask = async (req, res) => {
    const { id } = req.params;
    const { Progress } = req.body;

    try {
        console.log("Request Body:", req.body); // Add this line to debug

        if (!id || !Progress) {
            return res.status(400).json({
                error: true,
                message: "Something went wrong || Missing some fields"
            });
        }

        const updatetask = await Task.findByIdAndUpdate(id, {
            Progress
        }, { new: true });

        console.log("Updated data", updatetask); // Also log the updated task

        return res.status(200).json({
            error: false,
            message: "Task details updated successfully",
            data: updatetask
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Internal Server error ${error}`
        });
    }
}

module.exports = { Addtask, Getalltask, Getsingletask, Updatetask };