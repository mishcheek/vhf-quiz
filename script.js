document.addEventListener("DOMContentLoaded", () => {
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let questionsData;
  let selectedAnswer = null;

  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const submitButton = document.getElementById("submit-button");
  const nextButton = document.getElementById("next-button");
  const feedbackElement = document.getElementById("feedback");
  const quizContainer = document.querySelector(".quiz-container");

  function loadQuestions() {
    fetch("questions.json")
      .then((response) => response.json())
      .then((data) => {
        questionsData = data;
        loadCategory();
      })
      .catch((error) => console.error("Error loading questions:", error));
  }

  function loadCategory() {
    if (questionsData && currentCategoryIndex < questionsData.length) {
      const currentCategory = questionsData[currentCategoryIndex];
      if (
        currentCategory.questions &&
        currentQuestionIndex < currentCategory.questions.length
      ) {
        loadQuestion(currentCategory.questions[currentQuestionIndex]);
      } else if (questionsData.length > currentCategoryIndex + 1) {
        currentQuestionIndex = 0;
        currentCategoryIndex++;
        loadCategory();
      } else {
        endQuiz();
      }
    } else {
      endQuiz();
    }
  }

  function loadQuestion(questionObj) {
    questionElement.textContent = questionObj.question;
    optionsContainer.innerHTML = "";
    questionObj.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => selectOption(option));
      optionsContainer.appendChild(button);
    });
    feedbackElement.textContent = "";
    submitButton.style.display = "block";
    nextButton.style.display = "none";
    selectedAnswer = null;
    // Remove any previous highlighting
    optionsContainer.querySelectorAll("button").forEach((btn) => {
      btn.classList.remove("correct-answer");
      btn.classList.remove("incorrect-answer");
    });
  }

  function selectOption(option) {
    const currentActive = document.querySelector(
      "#options-container button.selected"
    );
    if (currentActive) {
      currentActive.classList.remove("selected");
    }
    const selectedButton = Array.from(optionsContainer.children).find(
      (btn) => btn.textContent === option
    );
    if (selectedButton) {
      selectedButton.classList.add("selected");
      selectedAnswer = option;
    }
  }

  submitButton.addEventListener("click", () => {
    if (selectedAnswer) {
      if (
        questionsData &&
        questionsData[currentCategoryIndex] &&
        questionsData[currentCategoryIndex].questions &&
        questionsData[currentCategoryIndex].questions[currentQuestionIndex]
      ) {
        const currentQuestion =
          questionsData[currentCategoryIndex].questions[currentQuestionIndex];
        const answerButtons = Array.from(optionsContainer.children);
        const correctAnswerButton = answerButtons.find(
          (btn) => btn.textContent === currentQuestion.answer
        );
        const selectedAnswerButton = answerButtons.find(
          (btn) => btn.textContent === selectedAnswer
        );

        if (selectedAnswer === currentQuestion.answer) {
          feedbackElement.textContent = "Correct!";
          feedbackElement.className = "correct";
          if (correctAnswerButton) {
            correctAnswerButton.classList.add("correct-answer");
          }
        } else {
          feedbackElement.textContent = `Incorrect. The correct answer is: ${currentQuestion.answer}`;
          feedbackElement.className = "incorrect";
          if (selectedAnswerButton) {
            selectedAnswerButton.classList.add("incorrect-answer");
          }
          if (
            correctAnswerButton &&
            selectedAnswer !== currentQuestion.answer
          ) {
            correctAnswerButton.classList.add("correct-answer");
          }
        }
        submitButton.style.display = "none";
        nextButton.style.display = "block";
      }
    } else {
      feedbackElement.textContent = "Please select an answer.";
      feedbackElement.className = "incorrect";
    }
  });

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (
      questionsData &&
      questionsData[currentCategoryIndex] &&
      currentQuestionIndex <
        questionsData[currentCategoryIndex].questions.length
    ) {
      loadQuestion(
        questionsData[currentCategoryIndex].questions[currentQuestionIndex]
      );
    } else {
      currentQuestionIndex = 0;
      currentCategoryIndex++;
      loadCategory();
    }
  });

  function endQuiz() {
    quizContainer.innerHTML = `
            <h1>Quiz Ended!</h1>
            <p>Thank you for playing!</p>
            <button onclick="location.reload()">Play Again?</button>
        `;
  }

  loadQuestions();
});
