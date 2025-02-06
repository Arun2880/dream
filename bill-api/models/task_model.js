const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Task Schema
const TaskSchema = new Schema({
    project_title: {
        type: String,
        required: true,
    },
    project_description: {
        type: String,
        required: false,
    },
    assignee: {
        type: Schema.Types.ObjectId, // Reference to the Client model
        ref: 'Employee', // This should match the name of the Client model
        required: true,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    Status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'], // Example status values
        default: 'Pending',
        required: true,
    },
    
    Progress: {
        type: String,
        
    },
    is_delete: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);