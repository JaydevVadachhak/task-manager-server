const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: '8',
        validate(value) {
            if (value.toLowerCase().includes('test')) {
                throw new Error('Passworn should not contain string "Test"')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age should be in positive number')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

schema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    
    return userObject
}

schema.methods.generateToken = async function() {
    const user = this
    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SEC_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token
}

schema.statics.userLogin = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('User not found')
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid password')
    }

    return user;
}

schema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

schema.pre('remove', async function(next) {
    const user = this;

    await Task.deleteMany({ user: user._id});

    next()

})

const User = mongoose.model('User', schema)

module.exports  = User;
