const express = require('express');
const path = require('path');
const cors = require('cors');
const SessionController = require('./controllers/SessionController');
const SetupController = require('./controllers/SetupController');
require('./database');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());

    this.server.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });

    this.server.use(express.static(path.resolve(__dirname, '..', 'admin-web', 'build')));
  }

  routes() {
    // Setup routes
    this.server.get('/api/setup/status', SetupController.status);
    this.server.post('/api/setup/database', SetupController.setupDatabase);
    this.server.post('/api/setup/admin', SetupController.setupAdmin);
    this.server.post('/api/setup/finish', SetupController.finishSetup);

    // Session routes
    this.server.post('/api/sessions', SessionController.store);
    this.server.post('/api/sessions/otp', SessionController.sendOtp);
    this.server.post('/api/sessions/forgot-password', SessionController.forgotPassword);
    this.server.post('/api/sessions/reset-password', SessionController.resetPassword);

    // Private routes
    const privateRoutes = require('./routes/private.routes');
    this.server.use('/api', privateRoutes);

    this.server.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'admin-web', 'build', 'index.html'));
    });
  }
}

module.exports = new App().server;
