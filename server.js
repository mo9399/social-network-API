//Dependancies
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001; 

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

//Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-API', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true);

app.listen(PORT, () => console.log('Connected To localhost:${PORT}'));