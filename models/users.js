const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Please insert your name'],
        trim: true
    },
    email:{
        type: String, 
        required: [true, 'Please insert your email'],
        trim: true,
        lowercase: true, 
        validate:{
            validator: function(v){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
            }, 'Please insert a valid email'
        }
    },
    password:{
        type: String,
        required: [true, 'Please insert your password'],
        minlength: [8, 'Your password must have at least 8 characteres']
    },
    birthYear:{
        type: Number, 
        required:[true, 'Please insert your birth year']
    },
    is_admin:{
        type: Number,
        default: 0
    },
    is_banned:{
        type: Number,
        default: 0
    },
    created_on:{
        type: Date,
        default: Date.now
    },
    image:{
        data: Buffer,
        contentType: String
    }

})

const User = model('user', userSchema)

module.exports = User