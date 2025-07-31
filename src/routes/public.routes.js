const { Router } = require('express');
const sessionsRouter = require('./sessions.routes');
const setupRouter = require('./setup.routes');

const publicRoutes = Router();

publicRoutes.use('/sessions', sessionsRouter);
publicRoutes.use('/setup', setupRouter);

module.exports = publicRoutes;
