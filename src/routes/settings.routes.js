const { Router } = require('express');
const multer = require('multer');
const SettingsController = require('../controllers/SettingsController');
const adminMiddleware = require('../middlewares/admin');
const uploadConfig = require('../config/upload');

const settingsRouter = Router();
const upload = multer(uploadConfig);

settingsRouter.use(adminMiddleware);

settingsRouter.get('/', SettingsController.show);
settingsRouter.post('/', upload.single('logo'), SettingsController.store);
settingsRouter.post('/test-ses', SettingsController.testSesConnection);
settingsRouter.get('/custom.css', SettingsController.getCss);

module.exports = settingsRouter;
