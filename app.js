const express = require('express');
const app = express();

const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose')
const csurf =require('csurf')
const bodyParser = require('body-parser')


app.set('view engine','pug');
app.set('views','./views');

const adminRouter = require('./routes/admin')
const userRoute = require('./routes/shop')
const accountRoute =require('./routes/account')

const errorController = require('./controllers/error');

const User = require('./models/user');

var store = new mongoDbStore({
    uri:'mongodb+srv://mongo:mongo@cluster0.wxump.mongodb.net/node-app?retryWrites=true&w=majority',
    collection:'mySessions'
})

app.use(bodyParser.urlencoded({extended:false}))/// formdan gelenleri okumak için
app.use(cookieParser());
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false, 
    cookie:{
        maxAge:3600000
    },
    store:store,
}))
app.use(express.static(path.join(__dirname,'public')))///publicten css ve image leri kullanmak için

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>{console.log(err)})
})
app.use(csurf());

app.use('/admin',adminRouter);
app.use(userRoute);
app.use(accountRoute);

////üsteki middilewareler respons döndürmediği zaman yani geçersiz url girildiği zaman otamtik olarak alttaki middlware e yçnlenecek yani o sayfa hata sayfamız olacak
app.use('/500', errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {

    res.status(500).render('error/500', { title: 'Error' });
});

mongoose.connect('mongodb+srv://mongo:mongo@cluster0.wxump.mongodb.net/node-app?retryWrites=true&w=majority').then(()=>{
    console.log('connected')
    app.listen(3000);
}).catch(err=>{
    console.log(err);
})


