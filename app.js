const express       = require('express');
const exphbs        = require('express-handlebars');
const app           = express();
const path          = require('path');
const db            = require('./src/db/connection');
const bodyParser    = require('body-parser');
const Job           = require('./src/models/Job');
const Sequelize     = require('sequelize');
const Op            = Sequelize.Op;


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`O Express está rodando na porta ${PORT}`);
});

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set('views', path.join(__dirname, 'src', 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db  .authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(error => {
        console.log("Ocorreu um erro ao conectar", error);
});

// routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%';

    if(!search){
        Job.findAll({ order: [
            ['createdAt', 'DESC']
        ]})
        .then((jobs) => {
            
            res.render('index', {
                jobs
            });
        })
        .catch(error => console.log(error));
        
    } else {
        Job.findAll({ 
            where: {title: {[Op.like]: query}},
            order: [
            ['createdAt', 'DESC']
        ]})
        .then((jobs) => {
            
            res.render('index', {
                jobs, search
            });
        })
        .catch(error => console.log(error));
    }

   
    
});

//jobs routes
app.use('/jobs', require("./src/routes/jobs"));