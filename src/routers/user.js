const express = require('express');
const multer = require('multer')
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/api/users', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        const token = await newUser.generateToken();
        res.status(201).send({newUser, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.userLogin(req.body.email, req.body.password)
        const token = await user.generateToken();
        res.send({ user, token })
    } catch(e) {
        res.status(400).send();
    }
})

router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
           return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch(e) {
        res.status(500).send();
    }
})

router.post('/api/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send()
    } catch(e) {
        res.status(500).send();
    }
})

router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/api/users/me', auth,  async (req, res) => {
    const updatedFields = Object.keys(req.body);
    const allowedFields = ['name', 'email', 'password', 'age'];
    const isValidOperation = updatedFields.every(field => allowedFields.includes(field));
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid fields entered'})
    }
    
    try {
        updatedFields.forEach(field => req.user[field] = req.body[field])
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send();
    }
})

router.delete('/api/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user)
    } catch(e) {
        res.status(500).send();
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.jpg')) {
            return cb(new Error('Please upload JPG file only'))
        }

        cb(undefined, true)
    }
})

router.post('/api/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/api/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/api/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;
