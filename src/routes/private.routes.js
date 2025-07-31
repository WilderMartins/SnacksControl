const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');
const usersRouter = require('./users.routes');
const productsRouter = require('./products.routes');
const consumptionsRouter = require('./consumptions.routes');
const settingsRouter = require('./settings.routes');
const categoriesRouter = require('./categories.routes');

const privateRoutes = Router();

privateRoutes.use(authMiddleware);

privateRoutes.use('/users', usersRouter);
privateRoutes.use('/products', productsRouter);
privateRoutes.use('/consumptions', consumptionsRouter);
privateRoutes.use('/settings', settingsRouter);
privateRoutes.use('/categories', categoriesRouter);

module.exports = privateRoutes;
