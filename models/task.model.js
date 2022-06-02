const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String // active, completed
    },
    dueDate: {
        type: String
    }
});

module.exports = mongoose.model( 'Task', taskSchema );