const {Router} = require('express')
const {check, body} = require('express-validator/check')
const userController = require('../controllers/user.controller')
const User = require('../models/user.model')
const isAuth = require('../middleware/auth')

const router = new Router()

router.put('/signup',[check('email').isEmail().trim().custom(async(value, {req})=>{
    const user = await User.findOne({email: value})
    if(user){
        return Promise.reject('email already exist')
    }
})
.normalizeEmail().withMessage('Please provide correct email'),
check('password', 'Pasword must minmum 5 char').isAlphanumeric()
.isLength({min:5}).trim().not().isEmpty(),
body('name', 'Please provide a name').isString().trim()
], userController.signup)
router.post('/login',[check('email').isEmail().trim().custom(async(value, {req})=>{
    const user = await User.findOne({email: value})
    if(!user){
        return Promise.reject(`user doesn't exist`)
    }
})
.withMessage('Wrong email or password'),
check('password', 'Pasword must minmum 5 char').isAlphanumeric()
.isLength({min:5}).trim()], userController.login)

router.get('/status',isAuth, userController.status)
router.put('/status', isAuth, userController.updateStatus)

module.exports = router

