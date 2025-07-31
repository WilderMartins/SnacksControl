const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../config/upload');
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const productsRouter = Router();
const upload = multer(uploadConfig);

productsRouter.use(authMiddleware);

productsRouter.post('/bulk', adminMiddleware, upload.single('file'), ProductController.bulkStore);
productsRouter.post('/', adminMiddleware, ProductController.store);
productsRouter.put('/:id', adminMiddleware, ProductController.update);
productsRouter.get('/', ProductController.index);
productsRouter.delete('/:id', adminMiddleware, ProductController.delete);

module.exports = productsRouter;
