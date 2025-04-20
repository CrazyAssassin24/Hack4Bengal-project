const express = require("express");
const app = express();
const path = require('path');
const userModel = require("./models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const { log } = require('console');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.get('/', (req,res) => {
    res.render("index");
})

app.get('/read', async (req,res) => {
    let users = await userModel.find();
    res.render("read", {users});
})

app.get('/create', async (req,res) => {
    res.render("create");
})
app.get('/about', async (req,res) => {
    res.render("about");
})

app.get('/delete/:id', async (req,res) => {
    let users = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect("/read");
})

app.post('/update/:userid', async (req,res) => {
    let {locality,name,common,rooms,fees,contact,other,email} = req.body;
    let user = await userModel.findOneAndUpdate({_id: req.params.userid},{locality,name,common,rooms,fees,contact,other,email},{new:true});
    res.redirect("/read");
})

app.get('/login/:userid', async (req,res) => {
    let user = await userModel.findOne({_id: req.params.userid});
    
    res.render("login",{user});
})

app.post('/create', async (req,res) => {
    let {locality,name,common,rooms,fees,contact,other,password,email} = req.body;

    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password, salt, async (err,hash) => {
            let createdUser = await userModel.create({
                name:name,
                locality:locality,
                common:common,
                rooms:rooms,
                fees:fees,
                contact:contact,
                other:other,
                password:hash,
                email:email
            })

            let token = jwt.sign({email}, "shhhh");
            res.cookie("token",token);

            res.redirect('/read');
            
        })
    })

})

app.post('/login', async function(req,res){
    let user = await userModel.findOne({email: req.body.email});
    console.log("start");
    if(!user) return res.send('something went wrong');

    bcrypt.compare(req.body.password,user.password, function(err,result){
        console.log(req.body);
        console.log(user);
        if(result) {
            let token = jwt.sign({email:user.email}, "shhhh");
            res.cookie("token",token);
            res.render('edit',{user});
        }
        else res.send('something is wrong');
        
    });
})

app.listen(3000);