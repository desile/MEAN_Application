/**
 * Created by DeSile on 9/17/2016.
 */
var mongoose = require("mongoose");
var express = require("express");
var cors = require("cors");
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var validator = require('express-validator');

var app = express();


var whitelist = [
    'http://localhost:3111',
    'http://localhost:63342'
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

app.use(cors(corsOptions));
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'secret_key',
    saveUninitialized: false,
    resave: false
}));
//app.use(express.static(path.join(__dirname, 'public')));


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/meanapp');

var Product = mongoose.model('Product', {name:String});
var User = mongoose.model('User', {login:String, password:String, email:String, role:String});

app.route("/").get( function(req,res){
   res.send(req.session.user);
});

app.route("/adverts").get( function(req,res){
    Product.find(function (err, adverts){
        res.send(adverts);
    });
});

app.route("/adverts").put( function(req,res) {
    if(!req.session.user){
        res.sendStatus(403);
    } else {
        var name = req.body.name;
        var product = new Product({name: name});
        product.save(function (err) {
            res.send();
        });
    }
});

app.route("/adverts").delete( function(req,res) {
    if(!req.session.user){
        res.sendStatus(403);
    } else {
        var name = req.body.name;
        Product.remove({ name: name }, function (err) {
            res.send();
        });
    }
});

app.route("/login").post( function(req,res) {
    var login = req.body.login;
    User.findOne({ login: login}, function(err,user){
        if (user){
            req.session.user=user;
            res.status(200).send({login: user.login, role: user.role});
        } else {
            res.status(200).json({error: 'Пользователь не найден'});
        }
    });

});

app.route("/logout").get( function(req,res) {
    req.session.user = null;
    res.sendStatus(200);
});

app.route("/register").post( function (req,res){
    var login = req.body.login;
    var password = req.body.pass;
    var email = req.body.email;
    var role = 'user';
    var newUser = new User({login:login,password:password,email:email,role:role});
    newUser.save(function(err){
        if (err){
            res.status(200).json({error: "Произошла ошибка!"});
        } else {
            req.session.user=newUser;
            res.status(200).send({login: newUser.login, role: newUser.role});
        }
    })
});

app.listen(3111);

/*
var advert = new Product({name: "SomeProduct"});
advert.save(function(err){
    if(err){
        console.log("failed");
    } else {
        console.log("saved");
    }
});
*/