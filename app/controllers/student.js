const { UploadedQuestions, UploadedAnswer, studentbarchart, studentexamstatus,CreateDescriptiveModel,DescriptiveAnswer,UploaddescriptiveQuestions } = require('../models/studentmark.model'); // Adjust the path as necessary


let isSubmitting = false; // To track submission state



// Controller function to handle descriptive answer submission
exports.descriptive = (req, res) => {
  if (isSubmitting) {
    return res.status(429).send({ message: "Request already in progress." });
  }

  isSubmitting = true;

  console.log('Request Body:', req.body);

  const {
    notcomplete,
    class: studentClass,
    rollno,
    completed,
    name,
    answers,
    testname,
    subject,
    examdate,
    duration,
    question
  } = req.body;

  const score = "Not yet calculated";

  if (score === undefined || rollno === undefined || completed === undefined || !answers) {
    isSubmitting = false;
    return res.status(400).send({ message: "Score, roll number, completed status, and answers are required." });
  }

  const tutorialData = {
    notcomplete: notcomplete || 0,
    class: studentClass || 'Unknown Class',
    rollno: rollno || 'Unknown Roll Number',
    completed: completed || 1,
    name: name || 'Unknown Name',
    score,
    testname: testname || 'Unknown Exam',
    subject,
    examdate,
    duration,
    answers,
    question
  };

  const newDescriptiveData = new CreateDescriptiveModel(tutorialData);

  CreateDescriptiveModel.createDescriptive(newDescriptiveData)
    .then(data => {
      isSubmitting = false;
      res.status(201).send(data);
    })
    .catch(err => {
      isSubmitting = false;
      res.status(500).send({
        message: err.message || "Some error occurred while creating the answer."
      });
    });
};


exports.markandanswer = async (req, res) => {
  if (isSubmitting) {
    return res.status(429).send({ message: "Request already in progress." });
  }

  isSubmitting = true;

  const {
    rollno,
    name,
    subject,
    marksArray,
    totalMark
  } = req.body;

  // Set score as totalMark or fallback message
  const score = totalMark ?? "Not yet calculated";

  // Validate required fields
  if (!rollno || !marksArray || !Array.isArray(marksArray)) {
    isSubmitting = false;
    return res.status(400).send({
      message: "Roll number, an array of marks, and total marks are required."
    });
  }

  // Create a new descriptive data model instance
  const newDescriptiveData = {
    rollno,
    name,
    subject,
    marksArray,
    totalMark
  };

  try {
    // Update descriptive marks
    const descriptiveData = await UploaddescriptiveQuestions.updateDescriptiveMarks(rollno,marksArray, totalMark, name, subject);

    // Update student marks
    const studentMarkData = await UploaddescriptiveQuestions.updateStudentMarks(rollno,totalMark, name, subject);

    // Handle success response
    isSubmitting = false;
    res.status(201).send({
      descriptiveData,
      studentMarkData,
      message: "Marks updated successfully."
    });
  } catch (err) {
    // Handle error response
    isSubmitting = false;
    console.error("Error in updating marks:", err); // Log error details
    res.status(500).send({
      message: err.message || "Some error occurred while updating marks."
    });
  }
};



// Handle marking submissions
exports.mark = (req, res) => {
  if (isSubmitting) return res.status(429).send({ message: "Request already in progress." });
  isSubmitting = true;

  console.log('Request Body:', req.body);
  
  const { 
    notcomplete,
    rollno, 
    question,
    completed,
    score, 
    name,
    class: studentClass,
    testname,
    subject,
    examdate,
    duration
  } = req.body;

  if (score === undefined || rollno === undefined || completed === undefined) {
    isSubmitting = false; // Reset on error
    return res.status(400).send({ message: "Score, roll number, and completed status are required." });
  }

  const tutorialData = {
    notcomplete: notcomplete || 0,
    class: studentClass || 'Unknown Class',
    rollno: rollno || 'Unknown Roll Number',
    completed: completed || 1,
    name: name || 'Unknown Name',
    score,
    question,
    testname: testname || 'Unknown Exam', // Use testname from request body
    subject,
    examdate,
    duration 
  };

  const newAnswer = new UploadedAnswer(tutorialData);

  UploadedAnswer.create(newAnswer)
    .then(data => {
      isSubmitting = false;
      res.status(201).send(data);
    })
    .catch(err => {
      isSubmitting = false;
      res.status(500).send({
        message: err.message || "Some error occurred while creating the answer."
      });
    });
};












// Retrieve all Uploaded Questions
exports.findAllstd = (req, res) => {
  const studentClass = req.query.class; // Get class from query parameters
  const subject = req.query.subject; // Get subject from query parameters

  UploadedQuestions.getAllstd(studentClass, subject, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving uploaded questions."
      });
    }
    res.send(data); // Send the retrieved data as the response
  });
};


// Retrieve data for the bar chart based on class and roll number
exports.findbardata = (req, res) => {
  const studentClass = req.query.class; // Get class from query parameters
  const rollno = req.query.rollno; // Get roll number from query parameters

  studentbarchart.findselectedstd(studentClass, rollno, (err, data) => {
      if (err) {
          return res.status(500).send({
              message: err.message || "Some error occurred while retrieving bar chart data."
          });
      }
      res.send(data); // Send the retrieved data as the response
  });
};

// Retrieve data for exam status
exports.examstatus = (req, res) => {
  const studentClass = req.query.class; // Get class from query parameters
  const rollno = req.query.rollno; // Get roll number from query parameters

  studentexamstatus.findselectedstatus(studentClass, rollno, (err, data) => {
      if (err) {
          return res.status(500).send({
              message: err.message || "Some error occurred while retrieving exam status data."
          });
      }
      res.send(data); // Send the retrieved data as the response
  });
};




// Retrieve data for exam status
exports.descriptiveanswers = (req, res) => {
  // Get user (name) and rollno from query parameters and extract the substring values
  const name = req.query.user ? req.query.user.substring(0, 50) : null; // Adjust the length as needed
  const rollno = req.query.rollno ? req.query.rollno.substring(0, 20) : null; // Adjust the length as needed
  const subject = req.query.subject ? req.query.subject.substring(0, 30) : null; // Extract subject if needed

  // Log the extracted values for debugging purposes
  console.log("Extracted Name:", name);
  console.log("Extracted Roll Number:", rollno);
  console.log("Extracted Subject:", subject); // Log the subject for debugging

  // Call the findDescriptiveAnswer method with the extracted parameters
  DescriptiveAnswer.findDescriptiveAnswer(name, rollno, subject, (err, data) => {
      if (err) {
          return res.status(500).send({
              message: err.message || "Some error occurred while retrieving exam status data."
          });
      }
      res.send(data); // Send the retrieved data as the response
  });
};


