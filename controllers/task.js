const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const db = require('../models/models');
const User = db.user;
const Task = db.task;

exports.addTask = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const description = req.body.description;

    const task = new Task({
        name,
        description
    });

    task.save(task)
        .then(() => res.send(task))
        .catch(err => {
            res.status(500).send({ message: err });
            return;
        }
    );
};

exports.updateTask = (req, res, next) => {

    const name = req.body.name;
    const description = req.body.description;

    const task = {
        name,
        description
    };

    Task.findByIdAndUpdate({_id:req.params.id}, task)
        .then(response => res.send(response))
        .catch(error => {
            res.status(500).send({ message: error });
            return;
        }
    );
};

exports.getTasks = (req, res, next) => {
    Task.find({})
        .then(tasks => res.send(tasks))
        .catch(error => console.log(error));
}

exports.deleteTask = (req, res, next) => {
    Task.findByIdAndRemove({_id:req.params.id})
        .then(task => res.send(task))
        .catch(error => console.log(error));
}