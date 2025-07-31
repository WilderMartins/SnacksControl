const { Router } = require('express');
const SetupController = require('../controllers/SetupController');

const setupRouter = Router();

setupRouter.get('/status', SetupController.status);
setupRouter.post('/database', SetupController.setupDatabase);
setupRouter.post('/admin', SetupController.setupAdmin);
setupRouter.post('/finish', SetupController.finishSetup);

module.exports = setupRouter;
