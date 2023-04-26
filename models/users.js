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
        unique: true,
        lowercase: true, 
        validate:{
            validator: function(v){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
            }, message: 'Please enter a valide e-mail'
        }
    },
    password:{
        type: String,
        required: [true, 'Please insert your password'],
        minlength: [8, 'Your password must have at least 8 characteres']
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
    // image:{
    //     type:String,
    //     default:'../public/images/default-user.jpg'
    // }

})

const User = model('user', userSchema)

module.exports = User