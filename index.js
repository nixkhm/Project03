document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("nameInput");
  const submitName = document.getElementById("submitName");
  const greeting = document.getElementById("greeting");
  const quizButtons = document.querySelector(".quiz-buttons");
  const jsQuizButton = document.getElementById("jsQuizButton");
  const leetcodeQuizButton = document.getElementById("leetcodeQuizButton");

  /* Submit button to continue quiz */
  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", checkAnswer);

  /* Index of current question in JSON array */
  let currQuestion = 0;

  /* Locally updates the correct answer for checkAnswer()  */
  let corrAnswer;

  /* Locally updates the explanation for renderWrongView() */
  let explanation;

  /* Locally updates scoreboard */
  let correctAnswersCount = 0;
  let totalQuestionsAttempted = 0;

  /* Locally updates quiz taking */
  let chosenQuiz;

  submitName.addEventListener("click", function () {
    const userName = nameInput.value.trim();

    if (userName !== "") {
      nameInput.style.display = "none";
      submitName.style.display = "none";

      greeting.innerHTML = `Hello, ${userName}! Please Select a Quiz to Take`;
      greeting.style.fontSize = "22px";
      greeting.style.background = "#427D9D";
      greeting.style.color = "white";
      greeting.style.borderRadius = "10px";

      quizButtons.style.display = "block";
    }
  });

  /* TypeScript Quiz Button */
  jsQuizButton.addEventListener("click", function () {
    quizButtons.style.display = "none";
    greeting.style.display = "none";
    chosenQuiz = 1;
    displayQuiz(1);
  });

  /* LeetCode Quiz Button */
  leetcodeQuizButton.addEventListener("click", function () {
    quizButtons.style.display = "none";
    greeting.style.display = "none";
    chosenQuiz = 2;
    displayQuiz(2);
  });

  /* Async. collects quiz data for every question and renders quiz view */
  function displayQuiz(quizId) {
    submitButton.style.display = "block";
    fetch(
      `https://my-json-server.typicode.com/nixkhm/project03_static_db/quizzes/${quizId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (currQuestion < data.questions.length) {
          corrAnswer = data.questions[currQuestion].correctAnswer;
          explanation = data.questions[currQuestion].explanation;
          renderQuizView(data.questions[currQuestion]);
        } else {
          renderEndOfQuiz();
        }
      });
  }

  function renderQuizView(questionData) {
    const source = document.getElementById("quiz_view").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({
      ...questionData,
      isTextQuestion: questionData.type === "text",
    });
    document.querySelector("#main_view").innerHTML = html;
    document.getElementById("scoreboard").style.display = "block";
  }

  function renderCorrectView() {
    submitButton.style.display = "none";
    correctAnswersCount++;
    totalQuestionsAttempted++;
    updateScoreboard();

    const source = document.getElementById("correct_view").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({});
    document.querySelector("#main_view").innerHTML = html;

    setTimeout(() => {
      currQuestion++;
      displayQuiz(chosenQuiz);
    }, 1000);
  }

  function renderWrongView() {
    submitButton.style.display = "none";
    totalQuestionsAttempted++;
    updateScoreboard();

    const source = document.getElementById("wrong_view").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ explanation });
    document.querySelector("#main_view").innerHTML = html;

    document
      .getElementById("nextQuestion")
      .addEventListener("click", function () {
        currQuestion++;
        displayQuiz(chosenQuiz);
      });
  }

  function renderEndOfQuiz() {
    submitButton.style.display = "none";
    const percentageScore =
      (correctAnswersCount / totalQuestionsAttempted) * 100;

    let endMessage;
    if (percentageScore >= 80) {
      endMessage = `Congratulations ${
        nameInput.value
      }! You passed the quiz with a score of ${percentageScore.toFixed(2)}%.`;
    } else {
      endMessage = `Sorry ${
        nameInput.value
      }, you failed the quiz with a score of ${percentageScore.toFixed(2)}%.`;
    }

    const source = document.getElementById("end_view").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ endMessage });
    document.querySelector("#main_view").innerHTML = html;

    document
      .getElementById("retakeQuiz")
      .addEventListener("click", function () {
        currQuestion = 0;
        correctAnswersCount = 0;
        totalQuestionsAttempted = 0;
        updateScoreboard();
        displayQuiz(chosenQuiz);
      });

    document
      .getElementById("returnToMain")
      .addEventListener("click", function () {
        location.reload();
      });
  }

  function updateScoreboard() {
    const correctAnswersElement = document.getElementById("correctAnswers");
    correctAnswersElement.textContent = `${correctAnswersCount} / ${totalQuestionsAttempted}`;
  }

  /* Either displays correct view or incorrect view */
  function checkAnswer() {
    const selectedAnswer = document.querySelector(
      'input[type="radio"]:checked'
    );

    if (selectedAnswer && selectedAnswer.value === corrAnswer) {
      renderCorrectView();
    } else if (document.getElementById("textAnswer")) {
      const textAnswer = document.getElementById("textAnswer").value.trim();
      if (textAnswer.toLowerCase() === corrAnswer.toLowerCase()) {
        renderCorrectView();
      } else {
        renderWrongView();
      }
    } else {
      renderWrongView();
    }
  }
});
