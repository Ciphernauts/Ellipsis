const { Router } = require('express');
const controller = require('../Controllers/Users')
 
const router = Router();

router.get('/users',controller.getUsers);
router.get('/users/:uid',controller.getUserById);
router.post('/users', controller.addUser);
router.delete('/users/:uid', controller.removeUser);
router.put('/users/:uid', controller.updateUser);
router.post('/users/login', controller.loginUser);
router.post('/users/register', controller.registerUser);

module.exports = router;