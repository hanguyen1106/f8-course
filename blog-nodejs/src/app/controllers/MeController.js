const Course = require('../model/Course');
const {mutipleMongooseToObject} = require('../../util/mongoose');
class MeController {
    //[GET] /me/stored/courses
    storedCourses(req, res,next) {
        let courseQuery = Course.find({});

        if(req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column] : req.query.type
            });
        }

        Promise.all([courseQuery,Course.countDocumentsDeleted()])
            .then(([courses,countDeleted]) => 
                res.render('me/stored-course', {
                    courses : mutipleMongooseToObject(courses),
                    countDeleted
                })
            )
    }

    //[GET] /me/trash/courses
    trashCourses(req, res,next) {
        Course.findDeleted({})
            .then(courses => res.render('me/trash-course', {
                courses : mutipleMongooseToObject(courses)
            }))
            .catch(next);
    }
}

module.exports = new MeController();
