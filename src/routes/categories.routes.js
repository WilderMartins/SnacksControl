const { Router } = require('express');
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const categoriesRouter = Router();

categoriesRouter.use(authMiddleware);

categoriesRouter.post('/', adminMiddleware, CategoryController.store);
categoriesRouter.put('/:id', adminMiddleware, CategoryController.update);
categoriesRouter.get('/', CategoryController.index);
categoriesRouter.delete('/:id', adminMiddleware, CategoryController.delete);

module.exports = categoriesRouter;
