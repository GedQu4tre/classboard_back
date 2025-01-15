const express = require('express');
const router = express.Router();
const {createStudent, getStudent, getStudents, updateStudent, deleteStudent} = require('../controllers/studentController');

// Create a new student
router.post('/create', createStudent);

// Get all students by ecole
router.get('/:ecole', getStudents);

// Get a single student
router.get('/:id', getStudent);

// Update a student
router.patch('update/:id/', updateStudent);

// Delete a student
router.delete('/delete/:id', deleteStudent);    

module.exports = router;