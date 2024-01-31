const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphdbs = require('express-handlebars');
const methodOverride = require('method-override');


const SortMiddleware = require('./app/middlewares/SortMiddleware');
const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

const app = express();
const port = 3000;

app.use(
    express.urlencoded({
        extended: true,
    }),
);
    
// Body Parse for POST method
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//HTTP Logger
app.use(morgan('combined'));

// method Override
app.use(methodOverride('_method'))

// Custom Middlewares
app.use(SortMiddleware);

// Template Engine
app.engine(
    'hbs',
    exphdbs.engine({
        extname: '.hbs',
        helpers : {
            sum : (a ,b) => a+b , 
            sortable : (field, sort) => {
                let sortType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default : 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc : 'oi oi-sort-descending'
                }
                const types = {
                    default : 'desc' ,
                    asc : 'desc',
                    desc : 'asc'
                }
                const icon = icons[sortType];
                const type = types[sortType];

                return `<a href="?_sort&column=${field}&type=${type}">
                        <span class="${icon}"></span>
                    </a>`
            }
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));
route(app);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
