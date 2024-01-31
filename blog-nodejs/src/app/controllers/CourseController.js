const Course = require('../model/Course');
const {mongooseToObject} = require('../../util/mongoose');
class CourseController {
    
    //[GET] / course/:slug
    show(req,res,next) {
        Course.findOne({})
            .then(course => res.render('courses/show', {course : mongooseToObject(course)}))
            .catch(next);
    }

    //[GET] / course/:slug
    create(req,res,next) {
        res.render('courses/create');
    }

    //[GET] / course/store
    store(req,res,next) {
        req.body.image = `https://cdn.fullstack.edu.vn/f8-production/courses/6.png`;
        const course = new Course(req.body);
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }
    //[POST] / course/:id/edit
    edit(req,res,next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit',{course : mongooseToObject(course)}))
            .catch(next);
        
    }

    //[PUT] / course/:id
    update(req,res,next) {
        Course.updateOne({ _id : req.params.id}, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }
    //[DELETE] / course/:id
    destroy(req,res,next) {
        Course.delete({_id:req.params.id}) 
            .then(() => res.redirect('back'))
            .catch(next);    
    }
    //[DELETE] / course/:id/force
    forceDestroy(req,res,next) {
        Course.deleteOne({_id:req.params.id}) 
            .then(() => res.redirect('back'))
            .catch(next);    
    }      

    //[PATCH] / course/:id/ restore
    restore(req,res,next) {
        Course.restore({_id:req.params.id}) 
            .then(() => res.redirect('back'))
            .catch(next);    
    }
    //[POST] / course/handle-form-action
    handleForm(req,res,next) {
        switch(req.body.action) {
            case 'delete' : 
                Course.delete({_id: {$in : req.body.courseIds}}) 
                .then(() => res.redirect('back'))
                .catch(next); 
                break;
            default: 
                res.send('Action Invalid');
        }
    }
}

module.exports = new CourseController();
