const { Router } = require('express');
const controller = require('../Controllers/Users')
 
const router = Router();

router.get('/',controller.getUsers);
router.get('/:uid',controller.getUserById);
router.post('/', controller.addUser);
router.delete('/:uid', controller.removeUser);
router.put('/:uid', controller.updateUser);
router.post('/login', controller.loginUser);
router.post('/register', controller.registerUser);

module.exports = router;