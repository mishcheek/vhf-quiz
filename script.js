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
    if (currentCategoryIndex < questionsData.length) {
      const currentCategory = questionsData[currentCategoryIndex];
      loadQuestion(currentCategory.questions[currentQuestionIndex]);
    } else {
      endQuiz();
    }
  }

  function loadQuestion(questionObj) {
    questionElement.textContent = questionObj.question;
    optionsContainer.innerHTML = ""; // Clear previous options
    questionObj.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => selectOption(option));
      optionsContainer.appendChild(button);
    });
    feedbackElement.textContent = ""; // Clear previous feedback
    submitButton.style.display = "block";
    nextButton.style.display = "none";
    selectedAnswer = null; // Reset selected answer
  }

  function selectOption(option) {
    // Deselect previously selected option
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
      const currentCategory = questionsData[currentCategoryIndex];
      const currentQuestion = currentCategory.questions[currentQuestionIndex];
      if (selectedAnswer === currentQuestion.answer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.className = "correct";
      } else {
        feedbackElement.textContent = `Incorrect. The correct answer is: ${currentQuestion.answer}`;
        feedbackElement.className = "incorrect";
      }
      submitButton.style.display = "none";
      nextButton.style.display = "block";
    } else {
      feedbackElement.textContent = "Please select an answer.";
      feedbackElement.className = "incorrect"; // Or just leave it without a class
    }
  });

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    const currentCategory = questionsData[currentCategoryIndex];
    if (currentQuestionIndex < currentCategory.questions.length) {
      loadQuestion(currentCategory.questions[currentQuestionIndex]);
    } else {
      currentQuestionIndex = 0; // Reset question index for the next category
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
