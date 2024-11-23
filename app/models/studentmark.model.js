const sql = require("./db.js");

class UploadedAnswer {
  constructor(uploadedAnswer) {
    this.rollno = uploadedAnswer.rollno;
    this.notcompeted = uploadedAnswer.notcomplete;
    this.completed = uploadedAnswer.completed;
    this.mark = uploadedAnswer.score;
    this.class = uploadedAnswer.class; // This should now refer to `studentClass` in the controller
    this.name = uploadedAnswer.name;
    this.testname = uploadedAnswer.testname;
    this.subject = uploadedAnswer.subject;
    this.examdate = uploadedAnswer.examdate;
    this.duration = uploadedAnswer.duration;
    this.created_date = uploadedAnswer.created_date || new Date();
  }





// Inside the UploadedAnswer.create method:
static create(newAnswer) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO student_mark SET ?";

    // Insert new answer into student_mark
    sql.query(query, newAnswer, (err, res) => {
      if (err) {
        console.error("Error while creating uploaded answer: ", err);
        return reject(err);
      }

      console.log("Created uploaded answer: ", { id: res.insertId, ...newAnswer });

      // Log the class value being used in the update query
      console.log("Class for update query:", newAnswer.class);

      // Increment the complete count and decrement notcomplete where class matches
      const updateQuery = `
      UPDATE uploadedquestions 
      SET complete = COALESCE(complete, 0) + 1, 
          notcomplete = GREATEST(COALESCE(notcomplete, 1) - 1, 0) 
      WHERE class = ?`;
  

      sql.query(updateQuery, [newAnswer.class], (updateErr, updateRes) => {
        if (updateErr) {
          console.error("Error while updating complete count in uploadedquestions: ", updateErr);
          return reject(updateErr);
        }

        if (updateRes.affectedRows === 0) {
          console.warn("No rows were updated. Please check the class value:", newAnswer.class);
        } else {
          console.log("Updated complete count in uploadedquestions for class:", newAnswer.class);
        }

        resolve({ id: res.insertId, ...newAnswer });
      });
    });
  });
}

}


// class CreateDescriptiveModel {
//   constructor(data) {
//     this.rollno = data.rollno;
//     this.subject = data.subject;
//     this.class = data.class;
//     this.testname = data.testname;
//     this.duration = data.duration;
//     this.examdate = data.examdate.split('T')[0] + ' ' + data.examdate.split('T')[1].slice(0, 8), // Format to 'YYYY-MM-DD HH:MM:SS'
//     this.createdon = new Date().toISOString().split('T')[0] + ' ' + new Date().toISOString().split('T')[1].slice(0, 8) // Current date in 'YYYY-MM-DD HH:MM:SS'
//     this.name = data.name;
//     this.question = data.question;
//     this.answer = data.answers;
//     this.mark = data.score;
//   }



//   static createDescriptive(newDescriptiveData) {
//     return new Promise((resolve, reject) => {
//       console.log("Data to be inserted into 'descriptive':", newDescriptiveData);

//       const insertQuery = "INSERT INTO descriptive SET ?";

//       // Check if `newDescriptiveData` has all required fields
//       const requiredFields = ['rollno', 'subject', 'question', 'class', 'answer', 'testname', 'duration', 'examdate', 'createdon'];
//       const missingFields = requiredFields.filter(field => !newDescriptiveData[field]);
//       if (missingFields.length > 0) {
//         console.error("Missing required fields:", missingFields);
//         return reject(new Error(`Missing required fields: ${missingFields.join(', ')}`));
//       }

//       // Insert new answer into the descriptive table
//       sql.query(insertQuery, newDescriptiveData, (err, res) => {
//         if (err) {
//           console.error("Error while creating descriptive answer:", err);
//           return reject(err);
//         }

//         console.log("Created descriptive answer:", { id: res.insertId, ...newDescriptiveData });

//         // Increment the complete count and decrement notcomplete where class matches
//         const updateQuery = `
//           UPDATE uploadedquestions 
//           SET complete = COALESCE(complete, 0) + 1, 
//               notcomplete = GREATEST(COALESCE(notcomplete, 1) - 1, 0) 
//           WHERE class = ?`;

//         sql.query(updateQuery, [newDescriptiveData.class], (updateErr, updateRes) => {
//           if (updateErr) {
//             console.error("Error while updating complete count in uploadedquestions:", updateErr);
//             return reject(updateErr);
//           }

//           if (updateRes.affectedRows === 0) {
//             console.warn("No rows were updated. Please check the class value:", newDescriptiveData.class);
//           } else {
//             console.log("Updated complete count in uploadedquestions for class:", newDescriptiveData.class);
//           }

//           resolve({ id: res.insertId, ...newDescriptiveData });
//         });
//       });
//     });
//   }
// }

class CreateDescriptiveModel {
  constructor(data) {
    this.rollno = data.rollno;
    this.subject = data.subject;
    this.class = data.class;
    this.testname = data.testname;
    this.duration = data.duration;
    this.examdate = data.examdate;
    this.createdon = new Date().toISOString().split('T')[0] + ' ' + new Date().toISOString().split('T')[1].slice(0, 8); // Current date in 'YYYY-MM-DD HH:MM:SS'
    this.name = data.name;
    this.question = data.question;
    this.answer = data.answers;
    this.mark = data.score;
    this.testtype = data.testtype || 'descriptive' ;
  }

  static createDescriptive(newDescriptiveData) {
    return new Promise((resolve, reject) => {
      console.log("Data to be inserted into 'descriptive':", newDescriptiveData);

      const insertQuery = "INSERT INTO descriptive SET ?";

      // Check if `newDescriptiveData` has all required fields
      const requiredFields = ['rollno', 'subject', 'question', 'class', 'answer', 'testname', 'duration', 'examdate', 'createdon'];
      const missingFields = requiredFields.filter(field => !newDescriptiveData[field]);
      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return reject(new Error(`Missing required fields: ${missingFields.join(', ')}`));
      }

      // Insert new answer into the descriptive table
      sql.query(insertQuery, newDescriptiveData, (err, res) => {
        if (err) {
          console.error("Error while creating descriptive answer:", err);
          return reject(err);
        }

        console.log("Created descriptive answer:", { id: res.insertId, ...newDescriptiveData });

        // Increment the complete count and decrement notcomplete where class matches
        const updateQuery = `
          UPDATE uploadedquestions 
          SET complete = COALESCE(complete, 0) + 1, 
              notcomplete = GREATEST(COALESCE(notcomplete, 1) - 1, 0) 
          WHERE class = ?`;

        sql.query(updateQuery, [newDescriptiveData.class], (updateErr, updateRes) => {
          if (updateErr) {
            console.error("Error while updating complete count in uploadedquestions:", updateErr);
            return reject(updateErr);
          }

          if (updateRes.affectedRows === 0) {
            console.warn("No rows were updated. Please check the class value:", newDescriptiveData.class);
          } else {
            console.log("Updated complete count in uploadedquestions for class:", newDescriptiveData.class);
          }

          // Call createStudentMark after the descriptive answer is successfully created
          CreateDescriptiveModel.createStudentMark(newDescriptiveData).then(() => {
            resolve({ id: res.insertId, ...newDescriptiveData });
          }).catch(err => {
            reject(err);
          });
        });
      });
    });
  }

  static createStudentMark(studentMarkData) {
    return new Promise((resolve, reject) => {
      console.log("Data to be inserted into 'student_mark':", studentMarkData);

      const insertQuery = "INSERT INTO student_mark SET ?";

      // Check if `studentMarkData` has all required fields
      const requiredFields = ['name', 'rollno', 'class', 'mark', 'testname', 'subject', 'examdate', 'duration','testtype'];
      const missingFields = requiredFields.filter(field => !studentMarkData[field]);
      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return reject(new Error(`Missing required fields: ${missingFields.join(', ')}`));
      }

      // Create the object to insert, setting completed, notcompeted, and created_date directly
      const dataToInsert = {
        name: studentMarkData.name, // Corrected syntax
        rollno: studentMarkData.rollno, // Corrected from studentMarkData.name to studentMarkData.rollno
        class: studentMarkData.class, // Corrected from studentMarkData.name to studentMarkData.class
        mark: studentMarkData.mark, // Corrected from studentMarkData.name to studentMarkData.mark
        testname: studentMarkData.testname, // Corrected from studentMarkData.name to studentMarkData.testname
        subject: studentMarkData.subject, // Corrected from studentMarkData.name to studentMarkData.subject
        examdate: studentMarkData.examdate, // Keeping the examdate as is from studentMarkData
        duration: studentMarkData.duration, // Keeping the duration as is from studentMarkData
        completed: 1, // Set completed to 1
        notcompeted: 0, // Set notcompeted to 0
         testtype:'descriptive',
        created_date: new Date().toISOString().split('T')[0] + ' ' + new Date().toISOString().split('T')[1].slice(0, 8) // Current date in 'YYYY-MM-DD HH:MM:SS'
       
      };

      // Insert new student mark into the student_mark table
      sql.query(insertQuery, dataToInsert, (err, res) => {
        if (err) {
          console.error("Error while creating student mark:", err);
          return reject(err);
        }

        console.log("Created student mark:", { id: res.insertId, ...dataToInsert });
        resolve({ id: res.insertId, ...dataToInsert });
      });
    });
  }
}





class UploadedQuestions {
  static getAllstd(studentClass, subject, result) {
    let query = "SELECT * FROM student_mark WHERE 1=1"; // Start with a base query

    // Check if studentClass is provided and is a string
    if (studentClass && typeof studentClass === 'string') {
      query += ` AND class = ${sql.escape(studentClass)}`; // Filter by class
    } else if (studentClass) {
      console.error('studentClass is not a string:', studentClass);
      return result(new Error("Invalid class type provided."), null);
    }

    // Check if subject is provided and is a string
    if (subject && typeof subject === 'string') {
      query += ` AND subject = ${sql.escape(subject)}`; // Filter by subject
    } else if (subject) {
      console.error('subject is not a string:', subject);
      return result(new Error("Invalid subject type provided."), null);
    }

    // Sort results by subject and class
    query += " ORDER BY subject, class";

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);
    });
  }
}



class studentbarchart {
  static findselectedstd(studentClass, rollno, result) {
      let query = "SELECT mark, testname FROM student_mark WHERE 1=1"; // Start with a base query

      // Check if studentClass is provided and is a string
      if (studentClass && typeof studentClass === 'string') {
          query += ` AND class = ${sql.escape(studentClass)}`; // Filter by class
      } else if (studentClass) {
          console.error('studentClass is not a string:', studentClass);
          return result(new Error("Invalid class type provided."), null);
      }

      // Check if rollno is provided and is a string
      if (rollno && typeof rollno === 'string') {
          query += ` AND rollno = ${sql.escape(rollno)}`; // Filter by roll number
      } else if (rollno) {
          console.error('rollno is not a string:', rollno);
          return result(new Error("Invalid roll number type provided."), null);
      }

      // Add the limit to the query
      query += " LIMIT 5";

      sql.query(query, (err, res) => {
          if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
          }
          result(null, res);
      });
  }
}


class UploaddescriptiveQuestions {
  // Update descriptive table with mark and totalmark columns
  static updateDescriptiveMarks(rollno, marksArray, totalMark,name, subject ) {
    return new Promise((resolve, reject) => {
        // Ensure all parameters are correctly defined
        if (!rollno || !marksArray || !totalMark || !name || !subject) {
            console.error("One or more parameters are missing:", { rollno, marksArray, totalMark, name, subject });
            return reject("Missing parameters");
        }

        // Convert marksArray to a string (JSON format) for storage
        const marksString = JSON.stringify(marksArray);

        // SQL query to update the 'descriptive' table
        const query = "UPDATE descriptive SET mark = ?, totalmark = ? WHERE rollno = ? AND name = ? AND subject = ?";

        // Log the query for debugging
        console.log("Executing query:", query, [marksString, totalMark, rollno, name, subject]);

        // Execute the SQL query
        sql.query(query, [marksString, totalMark, rollno, name, subject], (err, res) => {
            if (err) {
                console.log("Error updating descriptive table:", err);
                return reject(err);
            }

            // Log the affected rows for debugging
            console.log("Affected Rows in Descriptive Table:", res.affectedRows);
            
            if (res.affectedRows === 0) {
                console.log(`No matching records found in 'descriptive' table for rollno: ${rollno}, name: ${name}, subject: ${subject}`);
            }
            
            resolve(res);
        });
    });
  }

  // Update student_mark table with mark and totalmark columns
  static updateStudentMarks(rollno, mark, subject, name) {
    return new Promise((resolve, reject) => {
        // Ensure all parameters are correctly defined
        if (!rollno || !mark || !name || !subject) {
            console.error("One or more parameters are missing:", { rollno, mark, subject, name });
            return reject("Missing parameters");
        }

        // Query to update the student_mark table
        const query = "UPDATE student_mark SET mark = ? WHERE rollno = ? AND  subject= ? AND name = ?";

        // Log the query and parameters being executed
        console.log("Executing query:", query, [mark, rollno, name, subject]);

        // Execute the SQL query
        sql.query(query, [mark, rollno, name, subject], (err, res) => {
            if (err) {
                console.log("Error updating student_mark table:", err);
                return reject(err);
            }

            // Log the affected rows for debugging
            console.log("Affected Rows in Student Mark Table:", res.affectedRows);
            
            if (res.affectedRows === 0) {
                console.log(`No matching records found in 'student_mark' table for rollno: ${rollno}, name: ${name}, subject: ${subject}`);
            }
            
            resolve(res);
        });
    });
  }
}





class studentexamstatus {
  static findselectedstatus(studentClass, rollno, result) {
      // Start with a base query and conditionally add filters
      let query = "SELECT * FROM student_mark WHERE 1=1";
      const values = []; // Array to store parameter values for parameterized query

      // Validate and add studentClass to query if provided
      if (studentClass && typeof studentClass === 'string') {
          query += " AND class = ?";
          values.push(studentClass); // Add class to values for parameterized query
      } else if (studentClass) {
          console.error('Invalid class type provided:', studentClass);
          return result(new Error("Invalid class type provided."), null);
      }

      // Validate and add rollno to query if provided
      if (rollno && typeof rollno === 'string') {
          query += " AND rollno = ?";
          values.push(rollno); // Add rollno to values for parameterized query
      } else if (rollno) {
          console.error('Invalid roll number type provided:', rollno);
          return result(new Error("Invalid roll number type provided."), null);
      }

      // Sort by class and rollno
      query += " ORDER BY class, rollno";

      // Add limit to restrict the number of rows returned
      query += " LIMIT 5";

      // Execute the parameterized query
      sql.query(query, values, (err, res) => {
          if (err) {
              console.log("Error executing query:", err);
              result(err, null);
              return;
          }
          result(null, res); // Return the query result if successful
      });
  }
}



class DescriptiveAnswer {
  static findDescriptiveAnswer(name, rollno, subject, result) {
      // Start with a base query and conditionally add filters
      let query = "SELECT * FROM descriptive WHERE 1=1"; // Ensure the base query is correct
      const values = []; // Array to store parameter values for parameterized query

      // Validate and add name to query if provided
      if (name && typeof name === 'string') {
          query += " AND name = ?"; // Adjust column name to 'name'
          values.push(name); // Add name to values for parameterized query
      } else if (name) {
          console.error('Invalid name type provided:', name);
          return result(new Error("Invalid name type provided."), null);
      }

      // Validate and add rollno to query if provided
      if (rollno && typeof rollno === 'string') {
          query += " AND rollno = ?";
          values.push(rollno); // Add rollno to values for parameterized query
      } else if (rollno) {
          console.error('Invalid roll number type provided:', rollno);
          return result(new Error("Invalid roll number type provided."), null);
      }

      // Validate and add subject to query if provided
      if (subject && typeof subject === 'string') {
          query += " AND subject = ?";
          values.push(subject); // Add subject to values for parameterized query
      } else if (subject) {
          console.error('Invalid subject type provided:', subject);
          return result(new Error("Invalid subject type provided."), null);
      }

      // Log the final query and values for debugging
      console.log("Executing query:", query);
      console.log("With values:", values);

      // Execute the parameterized query
      sql.query(query, values, (err, res) => {
          if (err) {
              console.log("Error executing query:", err);
              result(err, null);
              return;
          }
          // Log the retrieved results for debugging
          console.log("Query results:", res);
          result(null, res); // Return the query result if successful
      });
  }
}





// Exporting both models together
module.exports = {
  UploadedQuestions,
  UploadedAnswer,
  studentbarchart,
  studentexamstatus,
  CreateDescriptiveModel,
  DescriptiveAnswer,
  UploaddescriptiveQuestions
  };