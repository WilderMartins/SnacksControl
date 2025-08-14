const { Router } = require('express');
const UserController = require('../controllers/UserController');
const adminMiddleware = require('../middlewares/admin');

const usersRouter = Router();

usersRouter.get('/', adminMiddleware, UserController.index);
usersRouter.get('/:id', UserController.show);
usersRouter.post('/', adminMiddleware, UserController.store);
usersRouter.put('/:id', adminMiddleware, UserController.update);
usersRouter.delete('/:id', adminMiddleware, UserController.delete);

usersRouter.patch('/:id/credits', adminMiddleware, UserController.updateCredits);
usersRouter.post('/credits/reset', adminMiddleware, UserController.resetAllCredits);
usersRouter.put('/:id/toggle-otp', adminMiddleware, UserController.toggleOtp);

module.exports = usersRouter;
