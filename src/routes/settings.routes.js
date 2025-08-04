const { Router } = require('express');
const multer = require('multer');
const SettingsController = require('../controllers/SettingsController');
const adminMiddleware = require('../middlewares/admin');
const authMiddleware = require('../middlewares/auth');
const uploadConfig = require('../config/upload');

const settingsRouter = Router();
const upload = multer(uploadConfig);

// Public routes
settingsRouter.get('/', SettingsController.show);
settingsRouter.get('/custom.css', SettingsController.getCss);

// Private and admin routes
settingsRouter.post('/', authMiddleware, adminMiddleware, upload.single('logo'), SettingsController.store);
settingsRouter.post('/test-ses', authMiddleware, adminMiddleware, SettingsController.testSesConnection);

module.exports = settingsRouter;
