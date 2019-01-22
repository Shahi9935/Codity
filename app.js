const express = require('express');
const bodyParser= require('body-parser');
const path = require('path');
const port= process.env.PORT||3000;

const app=express();
app.use(bodyParser.urlencoded({extended:false,limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

app.use(express.static('views'));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.render('index');
});

app.get("/coding-calendar",(Req,res)=>{
    res.render('coding-calendar');
});

app.get("/search-problems",(Req,res)=>{
    res.render('search-problems');
});

app.listen(port,()=>{
    console.log("Server Started");
})