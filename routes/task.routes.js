const express = require('express');
const { 
    addTask, 
    updateTask, 
    getTasks, 
    deleteTask 
} = require('../controllers/task');
const router = express.Router();

router.post('/task',
    addTask
);

router.post('/task/:id',
    updateTask
);

router.get('/tasks/',
    getTasks
);

router.delete('/task/:id',
    deleteTask
);

module.exports = router;