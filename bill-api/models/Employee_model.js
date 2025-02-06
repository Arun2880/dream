const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    emp_id: { type: String, required: true },
    emp_name: { type: String },
    emp_address: { type: String },
    emp_phone: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String },
    designation: { type: String },
    joining_date: { type: Date, required: true },
    salary: { type: Number, required: true },
    bank_name: { type: String },
    bank_account: { type: String },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }], // Reference to Task model
    is_deleted: { type: Number, default: 0 }
});

module.exports = mongoose.model('Employee', EmployeeSchema);