const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res) => {
    res.send('SERVER ONN');
});

app.listen(port, () => {
    console.log('SERVER IS RUNNING IS: ', port);
});