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

/*
TASK LIST
1. Составить структуру модели Advert
2. Взаимодействовать с объектами Advert в базе через их ID
3. Наполнить форму для полноценного добавления объектов Advert (можно пока без фото)
4. Наполнить темплэйт для полноценного просмотрао объектов Advert

5. (?) Поменять loggedAs на нормальное название
6. Сделать предобработчик запросов с проверкой ролей

 */


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

var Advert = mongoose.model('Advert', {title:String, flatSize:Number, roomNumber:Number, type:String, location:String, photo:String, description:String, createdBy:String });
var User = mongoose.model('User', {login:{type:String, unique:true}, password:String, email:String, role:String, phone:String, fName:String, sName:String});

app.route("/").get( function(req,res){
   res.send(req.session.user);
});

app.route("/adverts").get( function(req,res){
    Advert.find(function (err, adverts){
        res.send(adverts);
    });
});

app.route("/adverts").put( function(req,res) {
    if(!req.session.user){
        res.sendStatus(403);
    } else {
        var reqAdvert = {
            title: req.body.title,
            flatSize: req.body.flatSize,
            roomNumber: req.body.roomNumber,
            type: req.body.type,
            location: req.body.location,
            photo: req.body.photo,
            description: req.body.description,
            createdBy: req.session.user.login
        };
        var advert = new Advert(reqAdvert);
        advert.save(function (err,createdAdvert) {
            if (err){
                res.status(200).json({description: "Произошла ошибка!", err: err});
            } else {
                res.send(createdAdvert);
            }
        });
    }
});

app.route("/adverts").delete( function(req,res) {
    if(!req.session.user){
        res.sendStatus(403);
    } else {
        var id = req.body.advertId;
        Advert.remove({ id: id }, function (err) {
            res.send();
        });
    }
});

app.route("/login").post( function(req,res) {
    var login = req.body.login;
    User.findOne({ login: login}, function(err,user){
        if (user){
            req.session.user={login: user.login, role: user.role};
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
    var registerData = {
        login: req.body.login,
        password: req.body.pass,
        email: req.body.email,
        phone: req.body.phone,
        fName: req.body.fName,
        sName: req.body.sName,
        role: 'user'
    };
    var newUser = new User(registerData);
    newUser.save(function(err){
        if (err){
            res.status(200).json({error: "Произошла ошибка!"});
        } else {
            req.session.user={login: newUser.login, role: newUser.role};
            res.status(200).send({login: newUser.login, role: newUser.role});
        }
    })
});

app.listen(3111);

/*
var advert = new Advert({name: "SomeProduct"});
advert.save(function(err){
    if(err){
        console.log("failed");
    } else {
        console.log("saved");
    }
});
*/