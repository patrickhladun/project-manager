const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const db = require('../models/models');
const User = db.user;
const Project = db.project;

/**
 * addProject create a project only with Name and the Description
 */
exports.addProject = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const description = req.body.description;

    const project = new Project({
        name,
        description
    });

    project.save(project)
        .then(() => res.send(project._id))
        .catch(err => {
            res.status(500).send({ message: err });
            return;
        }
    );
};

/**
 * updateProject updates name, description, tasks
 */
exports.updateProject = (req, res, next) => {

    const name = req.body.name;
    const description = req.body.description;
    const task = req.body.task;

    const project = {
        name,
        description
    };

    Project.findByIdAndUpdate({_id:req.params.id}, project)
        .then(response => res.send(response))
        .catch(error => {
            res.status(500).send({ message: err });
            return;
        }
    );
};

exports.getProjects = (req, res, next) => {
    Project.find({})
        .then(projects => res.send(projects))
        .catch(error => console.log(error));
}

exports.deleteProject = (req, res, next) => {
    Project.findByIdAndRemove({_id:req.params.id})
        .then(project => res.send(project))
        .catch(error => console.log(error));
}