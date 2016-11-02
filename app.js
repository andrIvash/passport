const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const HttpError = require('./error').HttpError;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://localhost/test');
app.use(express.static('app'));

// данные пользователя
var user = {
    username: 'user',
    password: 'password',
    id: 1
};

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    done(null, user);
});

app.set('views', './src/template');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    key: 'keys',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));


// локальная стратегия
passport.use('loginUsers', new LocalStrategy((username, password, done) => {
        if (username === user.username && password === user.password) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
);


app.use(passport.initialize());
app.use(passport.session());


//Маршруты
app.get('/', (req, res) => {
    res.render('index', { });
});
// app.get('/private', isAuth, function (req, res) {
//     res.render('private', { });
// });
app.get('/private', isLoggedIn, (req, res) => {
    res.render('private', { });
});
// app.post('/submit', (req, res) => {
//     //требуем наличия логина и пароля в теле запроса
//     if (!req.body.username || !req.body.password) {
//         //если не указан логин или пароль - сообщаем об этом
//         return res.json({status: 'Укажите логин и пароль!'});
//     }
//     if (req.body.username !== user.username && req.body.password !== user.password) {
//         res.json({status: 'Логин и/или пароль введены неверно!'});
//     } else {
//         //если найден, то делаем пометку об этом в сессии пользователя, который сделал запрос
//         req.session.isReg = true;
//         res.json({status: 'Все ок, Добро пожаловать'});
//     }
// });

app.post('/submit', (req, res, next) => {
    passport.authenticate('loginUsers', (err, user) => {
        if (err) { return next(err); }
        if (!user) { return res.json({status: 'Укажите логин и пароль!'})}
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({status: 'Все ок, Добро пожаловать'});
        });
    })(req, res, next);
});

app.post('/del', (req, res) => {
    req.session.destroy();
    res.json({status: 'Сессия удалена'});
});



// запуск сервера
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

//обработка ошибок
function isAuth (req, res, next) {
    if (!req.session.isReg) {
        return next(new HttpError(401, "Авторизуйтесь"));
    }
    next();
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.sendStatus(401);
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status
    });
});
