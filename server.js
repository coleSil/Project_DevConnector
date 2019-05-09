const express = require('express');
const connectDB = require('./config/db');

const app = express(); 

// Connect to database
connectDB();

app.get('/', function(req,res){
    res.send('API Running')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server started on ${PORT}`));