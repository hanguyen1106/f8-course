const express = require('express');
const route = express.Router();

const courseController = require('../app/controllers/CourseController');

route.get('/create', courseController.create);
route.post('/store', courseController.store);
route.post('/handle-form-action', courseController.handleForm);
route.get('/:id/edit', courseController.edit);
route.put('/:id', courseController.update);
route.patch('/:id/restore', courseController.restore);
route.delete('/:id', courseController.destroy);
route.patch('/:id/force', courseController.forceDestroy);
route.get('/:slug', courseController.show);

module.exports = route;
