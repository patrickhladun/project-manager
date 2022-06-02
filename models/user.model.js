const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: 'Enter a last name'
    },
    password: {
        type: String,
        required: 'Enter a last name'
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    userType: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    account: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }
    ],
    role: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ],
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

module.exports = mongoose.model( 'User', userSchema );