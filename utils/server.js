const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

const authRoutes = require('../routes/auth');
const projectRoutes = require('../routes/project.routes');
const taskRoutes = require('../routes/task.routes');

function createServer() {
  const app = express();
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  
  app.use('/auth', authRoutes);
  app.use('/api', projectRoutes);
  app.use('/api', taskRoutes);
  return app;
}

module.exports = {
  createServer
};