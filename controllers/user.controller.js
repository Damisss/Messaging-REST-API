const User = require('../models/user.model')
const {validationResult} = require('express-validator/check')
const {hash, compare} = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next)=>{
   try {
       const {email, password, name} = req.body
       const errors = validationResult(req)
       if(!errors.isEmpty()){
           const error = new Error(errors.array()[0].msg)
           error.statusCode = 422
           throw error
       }
       const hashPassword = await hash(password, 12)
       const user =  new User({
           email,
           password: hashPassword,
           name
       })
      await user.save()
      res.status(201).json(user)
   } catch (err) {
       if(!err.statusCode){
           err.statusCode = 500
       }
       next(err)
   }

}

exports.login = async (req, res, next)=>{
    try {
        const {email, password} = req.body
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg)
            error.statusCode = 401
            throw error
        }
        const user = await User.findOne({email})
        const isMath = await compare(password, user.password)
        if(!isMath){
            const error = new Error('Invalid email or password')
            error.statusCode = 401
            throw error
        }
         const token = jwt.sign({userId: user._id.toString()}, 'superSecret',
          {expiresIn: '1h'})
        return res.status(200).json({token, userId: user._id.toString()})
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500 
        }
        next(err)
    }
}

exports.status = async(req, res, next)=>{
  try {
      const user = await User.findById(req.userId)
      if(!user){
          const error = new Error('no such user')
          error.statusCode = 422
          throw error
      }
      res.status(200).json(user)
  } catch (err) {
      if(!err.statusCode){
          err.statusCode = 500
      }
      next(err)
  }
}

exports.updateStatus = async(req, res, next)=>{
  try {
      const newStatus = req.body.status
      const user = await  User.findById(req.userId)
      console.log(user)
      if(!user){
        const error = new Error('no such user')
        error.statusCode = 422
        throw error
    }
    user.status = newStatus
    await user.save()
    return res.status(200).json(user)
  } catch (err) {
    if(!err.statusCode){
        err.statusCode = 500
    }
    next(err)
  }
}