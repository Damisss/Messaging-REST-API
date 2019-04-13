const {validationResult} = require('express-validator/check')
const Post = require('../models/feed.model')
const path = require('path')
const fs = require('fs')
const User = require('../models/user.model')
exports.getAllPost = async (req, res, next)=>{
 try {
     const currentpage = req.query.page
     const postPerPage = 2
     let totalAmountOfPost
     const amount = await Post.countDocuments()
      totalAmountOfPost = amount
    const posts = await Post.find().populate('creator')
    .skip((currentpage-1)* postPerPage)
    .limit(postPerPage)
    if(!posts){
        const error = new Error('No post found')
        error.statusCode = 404
        throw error
    }
    const post = posts.map(p=>{
       return {...p._doc,creator: p.creator[0].name}
    })
    res.status(200).json({posts: post, totalItems: totalAmountOfPost})
     
 } catch (err) {
     if(!err.statusCode){
         err.statusCode = 500
     }
     next(err)
 }
}
exports.createPost = async (req, res, next)=>{
try {
    const {title, content} = req.body
   
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg)
        error.statusCode = 422
        throw error
    }
    if(!req.file){
        const error = new Error('No file uploaded')
        error.statusCode = 422
        throw error
    }
    const post = await new Post({title, content, image: req.file.path, creator: req.userId})
    const user = await  User.findById(req.userId)
    if(!user){
        const error = new Error('No such user')
        error.statusCode = 422
        throw error
    }
    user.userPosts(post._id)
    await post.save()
   return  res.status(201).json({post:{...post._doc, creator:{_id: user._id, name: user.name}}} )
} catch (err) {
    if(!err.statusCode){
        err.statusCode = 500
    }
    next(err)
   
}

}

exports.getSinglePost = async (req, res, next)=>{
    try {
        const {postId} = req.params
        const post = await Post.findOne({_id: postId})
        if(!post){
           const error = new Error('No such  post')
           error.statusCode = 422
           throw error
        }
      return res.status(200).json({post: {...post._doc,creator:{name: 'Adama'} }})
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}
exports.updatePost = async (req, res, next)=>{
    try {
        const {postId} = req.params
        const errors  = validationResult(req)
        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg)    
            error.statusCode = 422
            throw error 
        }
        if(req.file ){
            req.body.image = req.file.path
            }
        const post = await Post.findById(postId)
        const user = await User.findById(req.userId)
       if( post.creator.toString() !== user._id.toString()){
        const error = new Error(`Unauthorized`)    
        error.statusCode = 403
        throw error  
       }
        if(!post){
          const error = new Error(`such post doesn't exist`)    
          error.statusCode = 422
          throw error
        }
        
        //const body = {...req.body, image: req.file? req.file.path:post.image }
         
        if(req.file && req.file.path !== post.image){
            deleteImage(post.image)
        }
       Object.keys(req.body).forEach(key=>{
            post[key] = req.body[key]
       })
       await post.save()   
       return res.status(200).json({post: {...post._doc, creator:{name: user.name}} })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }


}

exports.deletePost = async(req, res, next)=>{
    try {
        const {postId} = req.params
        const post = await Post.findById(postId)
        const user = await User.findById(req.userId)
        const findPostIndex = user.posts.findIndex(elt=>{
            return elt.toString() === postId.toString()
        })
        if(findPostIndex < 0 || post.creator.toString() !== user._id.toString() ){
            const error = new Error(`post doesn't belong to the user`)    
            error.statusCode = 422
            throw error
        }
         if(!post){
             const error = new Error('No such post')
             error.statusCode = 422
             throw error
         }
         user.posts.remove(postId)
         // user.posts.pull(postId)
            await user.save()
           deleteImage(post.image)
           await post.remove()
        return res.status(200).json({message: 'post deleted'})
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
 
}

//delete file
const deleteImage = (filePath)=>{
 
    fs.unlink(path.join(__dirname, '..', filePath), err=>console.log(err))
  }