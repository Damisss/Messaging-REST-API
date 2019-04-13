const express = require('express')
const {check, body }= require('express-validator/check')
const postController = require('../controllers/feed.controller')
const isAuth = require('../middleware/auth')

const router = express.Router()

//fetch all products
router.get('/allPosts', isAuth, postController.getAllPost)
//create product
router.post('/createPost',isAuth, [check('title').isString().isLength({min: 5}).withMessage('Validation failed'),
body('content', 'Validation has failed').isString().isLength({min: 5, max: 100})], postController.createPost)
//fetch one product
router.get('/singlePost/:postId',isAuth, postController.getSinglePost)
//update some in product
router.patch('/updatePost/:postId', isAuth,[check('title').isString().isLength({min: 5}).withMessage('Validation failed'),
body('content', 'Validation has failed').isString().isLength({min: 5, max: 100})], postController.updatePost)
//delete the selected product product
router.delete('/deletePost/:postId', isAuth, postController.deletePost)
module.exports = router

