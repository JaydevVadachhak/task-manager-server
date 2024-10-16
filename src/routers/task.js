const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/api/tasks', auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        user: req.user._id
    })
    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/api/tasks', auth, async (req, res) => {
    const query = {
        user: req.user._id
    }

    const sort = {};
    if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.order && req.query.order.toLowerCase() === 'desc' ? -1 : 1 
    }

    if (req.query.completed) {
        query.completed = req.query.completed === 'true'
    }

    try {
        const tasks = await Task.find(query, null, { sort, limit: req.query.limit, skip: req.query.skip })
        res.send(tasks)
    } catch(e) {
        res.status(500).send();
    }
})

router.get('/api/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, user: req.user._id})
        if (!task) {
            return res.status(404).send();    
        }
        res.send(task)
    } catch(e) {
        res.status(500).send();
    }
})

router.patch('/api/tasks/:id', auth, async (req, res) => {
    const updatedFields = Object.keys(req.body);
    const allowedFields = ['description', 'completed'];
    const isValidOperation = updatedFields.every(field => allowedFields.includes(field));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid fields entered'})
    }
    try {
        const task = await Task.findOne({_id: req.params.id, user: req.user._id})
        if (!task) {
            return res.status(404).send();    
        }
        updatedFields.forEach(update => task[update] = req.body[update])
        await task.save();
        res.send(task)
    } catch(e) {
        res.status(400).send();
    }
})

router.delete('/api/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, user: req.user._id})
        if (!task) {
            return res.status(404).send();    
        }
        res.send(task)
    } catch(e) {
        res.status(500).send();
    }
})

module.exports = router;
