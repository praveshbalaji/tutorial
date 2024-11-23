const sql = require("./db.js");


const UploadedQuestions = function(uploadedQuestion) {
  this.title = uploadedQuestion.Title;                // Corresponds to the Title field
  this.selectedClass = uploadedQuestion.class;        // Corresponds to the class field
  this.selectedSubject = uploadedQuestion.Subject; 
  this.notcomplete = uploadedQuestion.notcomplete;   // Corresponds to the Subject field
  this.examTitle = uploadedQuestion.examTitle;        // Corresponds to the ExamTitle field
  this.selectedDate = uploadedQuestion.ExamDate;      // Corresponds to the ExamDate field
  this.selectedTime = uploadedQuestion.TimeRange;     // Corresponds to the TimeRange field
  this.questions = uploadedQuestion.questions;         // Corresponds to the questions field (JSON string)
  this.options = uploadedQuestion.options;             // Corresponds to the options field (JSON string)
  this.answers = uploadedQuestion.answers;             // Corresponds to the answers field (JSON string)
  this.createdDate = uploadedQuestion.createdDate || new Date(); // Sets createdDate to now if not provided
};

// Create a new Uploaded Question
UploadedQuestions.create = (newQuestion, result) => {
  const query = "INSERT INTO uploadedquestions SET ?";
  sql.query(query, newQuestion, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created uploaded question: ", { id: res.insertId, ...newQuestion });
    result(null, { id: res.insertId, ...newQuestion });
  });
};

UploadedQuestions.getAll = (studentClass, result) => {
  let query = "SELECT * FROM uploadedquestions";
  
  if (studentClass) {
    query += ` WHERE class = ${sql.escape(studentClass)}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      if (typeof result === 'function') {
        result(null, err);
      }
      return;
    }
    if (typeof result === 'function') {
      result(null, res);
    }
  });
};



UploadedQuestions.getAllnoanswer = (studentClass, result) => {
  // Specify the columns to select, excluding the 'answer' column
  let query = "SELECT class, Subject, options, examTitle, ExamDate, questions ,complete,notcomplete,createdDate FROM uploadedquestions"; // List all columns except 'answer'
  
  if (studentClass) {
    query += ` WHERE class = ${sql.escape(studentClass)}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      if (typeof result === 'function') {
        result(null, err);
      }
      return;
    }
    if (typeof result === 'function') {
      result(null, res);
    }
  });
};



UploadedQuestions.getAllanswer = (studentClass, subject, result) => {
  // Start building the query to select answers from the database
  let query = "SELECT answers FROM uploadedquestions"; 

  // Check if class and subject are provided, and append them to the query
  let conditions = [];
  
  if (studentClass) {
    conditions.push(`class = ${sql.escape(studentClass)}`);
  }
  
  if (subject) {
    conditions.push(`subject = ${sql.escape(subject)}`);
  }

  // If there are conditions, add them to the query
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Execute the query
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      if (typeof result === 'function') {
        result(null, err);
      }
      return;
    }
    if (typeof result === 'function') {
      result(null, res);
    }
  });
};




// Remove all Uploaded Questions
UploadedQuestions.removeAll = (result) => {
  sql.query("DELETE FROM uploadedquestions", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};


const Tutorial = function(tutorial) {
  this.rollno = tutorial.rollno;
  this.class = tutorial.class;
};

Tutorial.getAllByRollNumberAndClass = (rollno, selectedClass, result) => {
  let query = "SELECT * FROM tutorials WHERE rollno = ? AND class = ?";
  
  sql.query(query, [rollno, selectedClass], (err, res) => {
      if (err) {
          console.error("Error retrieving tutorials: ", err);
          result(err, null);
          return;
      }
      result(null, res);
  });
};

// Exporting both models together
module.exports = {
UploadedQuestions,
Tutorial
};