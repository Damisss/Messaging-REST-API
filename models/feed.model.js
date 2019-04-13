const mongoose = require('mongoose')

const Schema =  mongoose.Schema

const postSchema = new Schema ({
    title: {
       type: String,
       required: [true, 'the title is required'],
       trim: true,
    },
    image:{
        type: String,
        required: [true, 'the image is required'],
    },
    content: {
        type: String,
        required: [true, 'the content is required'],
     },
     user:{
         type: Object,
         //required: [true, 'the content is required'],
     },
     creator:[{
         type: Schema.Types.ObjectId,
         ref: 'User'
     }]
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema)
module.exports = Post