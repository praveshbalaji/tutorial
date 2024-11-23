module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const student_mark = require("../controllers/student.js");
  const router = require("express").Router();

  // Define routes
  router.get("/student_marks", student_mark.findAllstd);
  router.post("/mark", student_mark.mark);

  router.post("/descriptive", student_mark.descriptive);
  router.post("/descriptivemark", student_mark.markandanswer);

  router.get("/studenbarchartmarks", student_mark.findbardata); // Ensure this is correct

  router.get("/studentexamstatus", student_mark.examstatus); // Ensure this is correct
  router.get("/descriptiveanswer", student_mark.descriptiveanswers); // Ensure this is correct



  router.post("/", tutorials.create);
  router.get("/", tutorials.findAll);
  router.get("/completed", tutorials.completedstd);
  router.get("/answer", tutorials.findAnswer);
  router.get("/studentquestion", tutorials.findAll2);
  router.delete("/", tutorials.deleteAll);

  app.use('/api/tutorials', router);
};
