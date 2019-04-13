const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    const authHeader = req.get('Authorization')
    if(!authHeader){
        const error = new Error('Unauthorized')
        error.statusCode = 401
        throw error 
    }
    const token = authHeader.split(' ')[1]
    let decode
    try {
        decode = jwt.verify(token, 'superSecret')
    } catch (error) {
         error.statusCode = 500
        throw error
    }
    if(!decode){
        const error = new Error('Unauthorized')
         error.statusCode = 401
         throw error
    }
    req.userId = decode.userId
    next()
}

