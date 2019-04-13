const mongoose = require('mongoose')

const Schema  = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 5
    },
    name:{
        type: String,
        required: true 
    },
    status:{
        type: String,
        default: 'I am new user' 
    },
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

userSchema.methods ={
 userPosts (postId){
     if(this.posts.indexOf() < 0){
        this.posts.push(postId)
     }
     //console.log(this.posts)
     return this.save()
 },
}

const User = mongoose.model('User', userSchema)

module.exports = User