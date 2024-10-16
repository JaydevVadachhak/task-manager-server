const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

require('./src/db/mongoose');

const taskRoutes = require('./src/routers/task')
const userRoutes = require('./src/routers/user')

app.use(cors());
app.use(express.json())
app.use(taskRoutes)
app.use(userRoutes)

app.post('/api/*', (req, res) => {
    res.status(400).send({ msg: 'Route not found'})
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

module.exports = app;
