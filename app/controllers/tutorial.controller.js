const { UploadedQuestions, Tutorial } = require('../models/tutorial.model'); // Adjust the path as necessary

exports.create = (req, res) => {
  const { 
    selectedClass, 
    selectedSubject, 
    notcomplete,
    examTitle, 
    selectedDate, 
    selectedTime, 
    questions, 
    options, 
    answers 
  } = req.body;

  // Validate required fields
  if (!questions || !options || !answers) {
    return res.status(400).send({ message: "Questions, options, and answers are required." });
  }

  const newTutorial = {
    class: selectedClass,
    Subject: selectedSubject,
    notcomplete: notcomplete,
    Title: examTitle,
    examTitle:examTitle,
    ExamDate: selectedDate,
    TimeRange: selectedTime,
    questions: JSON.stringify(questions),
    options: JSON.stringify(options),
    answers: JSON.stringify(answers),
    createdDate: new Date()
  };

  UploadedQuestions.create(newTutorial, (err, data) => {
    if (err) {
      return res.status(500).send({ message: err.message || "Some error occurred while creating the tutorial." });
    }
    res.status(201).send(data);
  });
};
exports.findAll = (req, res) => {
  const { class: studentClass } = req.query; // Retrieve the class query parameter

  UploadedQuestions.getAll(studentClass, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving uploaded questions."
      });
    }
    res.send(data);
  });
};

exports.findAnswer = (req, res) => {
  const studentClass = req.query.class; // Get class from query parameters
  const subject = req.query.subject;   // Get subject from query parameters

  // Call the model function with class and subject
  UploadedQuestions.getAllanswer(studentClass, subject, (err, data) => {
      if (err) {
          return res.status(500).send({ message: err.message || "Some error occurred while retrieving answers." });
      }
      res.send(data); // Send the retrieved data as the response
  });
};


exports.deleteAll = (req, res) => {
  UploadedQuestions.removeAll((err, data) => {
    if (err) {
      return res.status(500).send({ message: err.message || "Some error occurred while deleting tutorials." });
    }
    res.send({ message: 'All tutorials deleted successfully!' });
  });
};

exports.findAllstd = (req, res) => {
  // Assuming you're using a query parameter for student class
  const studentClass = req.query.class; // Change this according to how you're sending the class data
  console.log('Fetching all students for class:', studentClass);

  // Ensure to pass the studentClass and a callback
  UploadedQuestions.getAllstd(studentClass, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving tutorials."
      });
    }
    res.send(data);
  });
};

exports.findAll2 = (req, res) => {
  UploadedQuestions.getAllnoanswer(req.query.studentClass, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving questions."
      });
    }
    res.send(data);
  });
};

exports.completedstd = (req, res) => {
  const { rollnumber, class: selectedClass } = req.query;

  Tutorial.getAllByRollNumberAndClass(rollnumber, selectedClass, (err, data) => {
      if (err) {
          return res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." });
      }
      res.send(data);
  });
};

