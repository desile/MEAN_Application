/**
 * Created by DeSile on 9/17/2016.
 */
var mongoose = require("mongoose");
var express = require("express");
var cors = require("cors");
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var validator = require('express-validator');
var path = require('path');

var app = express();

/*
TASK LIST
1. Сделать предобработчик запросов с проверкой ролей
2. Ввести логирование
3. Сделать что-то с кучей вложенных колбэков
4. Описать спецификацию сервисов
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

var sessionStore = new session.MemoryStore();

app.use(cors(corsOptions));
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    store: sessionStore,
    secret: 'secret_key',
    saveUninitialized: false,
    resave: false
}));

var storage = multer.diskStorage({
    destination: function (req, file ,cb){
        cb(null, './imgs/');
    },
    filename: function (req, file, cb){
        cb(null, req.body.id + ".jpg");
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('advImg');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/meanapp');

var Advert = mongoose.model('Advert', {title:String, flatSize:Number, roomNumber:Number, type:String, location:String, img:String, description:String, createdBy:String, responds:[String] });
var User = mongoose.model('User', {login:{type:String, unique:true}, password:String, email:String, role:String, phone:String, fName:String, sName:String});

var userRoutesAllowed = [
    {
        url: "/adverts/checkrespond",
        method: "POST"
    },
    {
        url: "/adverts/responds",
        method: "GET"
    },
    {
        url: "/adverts/responds",
        method: "POST"
    },
    {
        url: "/adverts",
        method: "PUT"
    },
    {
        url: "/adverts",
        method: "DELETE"
    }
];

var arrayContainsObject = function(array, object, attributes){
    mainLoop:
        for(var i = 0; i < array.length; i++){
            for(attr in attributes){
                if(object[attributes[attr]] != array[i][attributes[attr]]){
                    continue mainLoop;
                }
            }
        return true;
        }
    return false;
};

app.use(function (req, res, next) {
    var request = {
        url: req.path,
        method: req.method
    };
    if(arrayContainsObject(userRoutesAllowed,request,["url","method"])){
        sessionStore.get(req.sessionID, function(err, session) {
            if (!session) {
                res.status(200).json({error: "Нет прав на совершение операции!"});
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

app.route("/").get( function(req,res){
   res.send(req.session.user);
});

app.route("/adverts/img").get( function (req,res){
    res.sendFile(req.query.id + '.jpg',{root:__dirname + '/imgs/'},function (err) {
        if (err) {
            res.json(err);
        }
    });
});

app.route("/adverts").get( function(req,res){
    Advert.find(function (err, adverts){
        res.send(adverts);
    });
});

app.route("/adverts/img").post( function(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,err_desc:null});
    })
});

app.route("/adverts/checkrespond").post(function (req,res) {
            var advertId = req.body.id;
            var login = req.session.user.login;
            Advert.findById(advertId, function(err,advert){
                if(err){
                    res.json({error: err});
                } else {
                    if(advert.responds && advert.responds.indexOf(login) > -1){
                        res.json({respond: 1});
                    } else {
                        res.json({respond: 0});
                    }
                }
            });
});

app.route("/adverts/responds").get(function(req,res) {
            var userLogin = req.session.user.login;
            var userRole = req.session.user.role;
            var advertCreatedBy = req.query.createdBy;
            var advertId = req.query.id;
            if(userLogin != advertCreatedBy && userRole != 'admin'){
                res.status(200).json({error: 'Нет прав на совершение операции!'});
            } else {
                Advert.findById(advertId, function (err, advert) {
                    if (err) {
                        res.status(200).json({description: "Произошла ошибка!", err: err});
                    } else {
                        User.find({
                            login: {
                                $in: advert.responds
                            }
                        }, function (err, users) {
                            if (err) {
                                res.status(200).json({description: "Произошла ошибка!", err: err});
                            }
                            else {
                                res.status(200).json({
                                    responds: users.map(function (user) {
                                        return {fName: user.fName, sName: user.sName, phone: user.phone};
                                    })
                                })
                            }
                        });
                    }
                });
            }
});

app.route("/adverts/responds").post (function(req,res) {
            var login = req.session.user.login;
            var advertId = req.body.id;
            var respond = req.body.respond;
            if (respond == 1) {
                Advert.findByIdAndUpdate(
                    advertId,
                    {$push: {"responds": login}},
                    {safe: true, upsert: true},
                    function (err) {
                        if (err) {
                            res.json({error: err});
                        } else {
                            res.sendStatus(200);
                        }
                    }
                );
            } else {
                Advert.findByIdAndUpdate(
                    advertId,
                    {$pull: {"responds": login}},
                    {safe: true},
                    function (err) {
                        if (err) {
                            res.json({error: err});
                        } else {
                            res.sendStatus(200);
                        }
                    }
                );
            }
});

app.route("/adverts").put( function(req,res) {
        var reqAdvert = {
            title: req.body.title,
            flatSize: req.body.flatSize,
            roomNumber: req.body.roomNumber,
            type: req.body.type,
            location: req.body.location,
            img: req.body.img,
            description: req.body.description,
            createdBy: req.session.user.login
        };
        var advert = new Advert(reqAdvert);
        advert.save(function (err,createdAdvert) {
            if (err){
                res.status(200).json({description: "Произошла ошибка!", err: err});
            } else {
                res.status(200).json(createdAdvert);
            }
        });
});

app.route("/adverts").delete( function(req,res) {
    var userLogin = req.session.user.login;
    var userRole = req.session.user.role;
    var advertCreatedBy = req.body.createdBy;
    var advertId = req.body.id;
    if(userLogin != advertCreatedBy && userRole != 'admin'){
        res.status(404).json({error: 'Нет прав на совершение операции!'});
    }

        Advert.remove({ _id: advertId }, function (err) {
            res.send();
        });
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
    req.session.destroy();
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