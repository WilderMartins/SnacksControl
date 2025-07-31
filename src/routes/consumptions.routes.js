const { Router } = require('express');
const ConsumptionController = require('../controllers/ConsumptionController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const consumptionsRouter = Router();

consumptionsRouter.use(authMiddleware);

consumptionsRouter.post('/', ConsumptionController.store);
consumptionsRouter.get('/', ConsumptionController.index);

consumptionsRouter.get('/summary/by-user', adminMiddleware, ConsumptionController.summaryByUser);
consumptionsRouter.get('/summary/by-product', adminMiddleware, ConsumptionController.summaryByProduct);
consumptionsRouter.get('/summary', adminMiddleware, ConsumptionController.summary);

module.exports = consumptionsRouter;
