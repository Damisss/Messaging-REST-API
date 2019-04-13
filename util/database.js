const mongoose = require('mongoose')

try {
    mongoose.connect('dataBase link')
} catch (error) {
    mongoose.createConnection('dataBase link')
}

mongoose.connection
.once('open', ()=>console.log('mongoose is running'))
.on('error', ()=>{
    throw error
})
