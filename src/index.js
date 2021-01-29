const express = require('express');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const {format} = require('timeago.js');

//initializations
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs');


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/img/uploads'),
    filename:(req, file, cb, filename) => {
        cb(null,uuidv4() + path.extname(file.originalname))
    }
})
app.use(multer({storage: storage}).single('image'));

//Routes
app.use(require('./routes/index'));

//Global variables 
app.use((req,res,next)=>{
    app.locals.format = format;
    next();
})
//static files
app.use(express.static(path.join(__dirname, 'public')))

//Server
app.listen(app.get('port'),() =>{
    console.log(`server listening on port ${app.get('port')}`)
})