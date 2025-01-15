const { Student } = require('../models/Student');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);

    const existingStudent = await Student.findOne({nom: student.nom, classe: student.classe });

    if (!existingStudent) {
      await student.save();
      res.status(201).json(student);
      // return res.status(404).json({ message: 'Student not found' });
    }
    else {
      res.status(400).json({ message: "Cet élève est déjà inscrit dans cette classe !" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  const {ecole} = req.params;
  try {
    const students = await Student.find({ecole: ecole}).populate({path: 'classe', select: '-nom_options -options'});
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classe');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'L\'élève n\'a pas été trouvé !' });
    }
    Object.assign(student, req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: "L'élève n'a pas été trouvé !" });
    }
    await Student.deleteOne({ _id: req.params.id });
    res.json({ message: "L'élève a été supprimé avec succès !" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};