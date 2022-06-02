const express = require('express');
const { 
    addProject, 
    updateProject, 
    getProjects, 
    deleteProject 
} = require('../controllers/project');
const router = express.Router();

router.post('/project',
    addProject
);

router.post('/project/:id',
    updateProject
);

router.get('/projects/',
    getProjects
);

router.delete('/project/:id',
    deleteProject
);

module.exports = router;