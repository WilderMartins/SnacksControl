const { Router } = require('express');
const settingsRoutes = require('./settings.routes');

const routes = Router();

routes.use('/settings', settingsRoutes);

module.exports = routes;
