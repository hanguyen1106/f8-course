const newRoutes = require('./news');
const siteRoute = require('./site');
const courseRoute = require('./courses');
const meRoute = require('./me');

function route(app) {
    app.use('/news', newRoutes);
    app.use('/', siteRoute);
    app.use('/courses', courseRoute);
    app.use('/me', meRoute);

    app.get('/search', (req, res) => {
        res.render('search');
    });
}

module.exports = route;
