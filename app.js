const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const postRoutes = require('./routes/feed.route')
const userRoutes = require('./routes/user.route')
require('./util/database')
const app = express()
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
      },
      filename: function (req, file, cb) {
        cb(null,   Date.now()+ '-' +file.originalname )
      }
})
function fileFilter (req, file, cb) {
    if(file.mimetype === 'image/jpeg'||file.mimetype === 'image/jpg'||file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, true)
    }
  }
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS')
   next()
})


 

app.use('/feed', postRoutes)
app.use('/user', userRoutes)

app.use((error, req, res, next )=>{
    console.log(error)
    const status = error.statusCode || 500 
    const message = error.message
    res.status(status).json({message})
})
app.listen(8080,
     ()=>console.log('server is running'))