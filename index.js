const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
let questions = [];

app.get("/questions", (req, res) => {
  if (questions.length == 0) {
    res.status(400).json({
      message: "There are no questions",
    });
  }
  questions.forEach((q) => {
    if (q.options) {
      q.options.forEach((option) => (option.iscorrect = null));
    }
  });

  res.send(questions);
});

app.post("/question", (req, res) => {
  if (req.body.question == undefined) {
    res.status(400).json({
      message: "Please pass question",
    });
  } else {
    req.body.id = questions.length + 1;
    questions.push(req.body);
    res.json({
      message: "question Created",
    });
  }
});

app.post("/question/:question_id", (req, res) => {
  if (req.body.option == undefined) {
    res.status(400).json({
      message: "please pass option",
    });
  } else if (questions.length == 0) {
    res.status(400).json({
      message: "There are no questions",
    });
  } else {
    let question = questions.findIndex(
      (obj, index) => obj.id == req.params.question_id
    );
    console.log(question);
    if (question == -1) {
      req.body.id = 1;
    }
    req.body.id = questions[question].options.length + 1;
    console.log(req.body.id);
    questions[question].options.push(req.body);
    res.json({
      message: "option created",
    });
  }
});

app.get("/question/:question_id/:option_id", (req, res) => {
  console.log(req.params.question_id, req.params.option_id);

  const questionIndex = questions.findIndex(
    (q) => q.id == req.params.question_id
  );
  console.log(questionIndex);
  if (questionIndex === -1) {
    res.status(400).json({ message: "Question not found" });
  } else {
    if (questions[questionIndex].options) {
      const optionIndex = questions[questionIndex].options.findIndex(
        (option) => option.id == req.params.option_id
      );
      console.log(optionIndex);
      if (optionIndex === -1) {
        res.status(400).json({ message: "Option not found" });
      } else {
        console.log(
          "option value",
          questions[questionIndex].options[optionIndex]
        );
        console.log(questions[questionIndex].options[optionIndex].iscorrect);
        if (questions[questionIndex].options[optionIndex].iscorrect) {
          res.json({ option: "Correct" });
        } else {
          res.json({ option: "Wrong" });
        }
      }
    }
  }
});

app.listen(3000);
