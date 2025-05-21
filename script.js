document.addEventListener("DOMContentLoaded", () => {
  let questionsData;
  let currentQuestionIndex = 0;
  let currentCategoryQuestions; // Array to hold questions for the selected category
  let selectedAnswer = null;
  let currentCategoryName = null;

  const categorySelection = document.getElementById("category-selection");
  const questionContainer = document.getElementById("question-container");
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const submitButton = document.getElementById("submit-button");
  const nextButton = document.getElementById("next-button");
  const feedbackElement = document.getElementById("feedback");
  const quizContainer = document.querySelector(".quiz-container");

  // Function to shuffle an array using Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadQuestions() {
    fetch("questions.json")
      .then((response) => response.json())
      .then((data) => {
        questionsData = data;
        displayCategorySelection();
      })
      .catch((error) => console.error("Error loading questions:", error));
  }

  function displayCategorySelection() {
    categorySelection.style.display = "block";
    const categoryButtons = document.querySelectorAll(".category-button");
    categoryButtons.forEach((button) => {
      button.addEventListener("click", function () {
        currentCategoryName = this.dataset.category;
        // Get the questions and shuffle them
        currentCategoryQuestions = shuffleArray([
          ...(questionsData.find((cat) => cat.category === currentCategoryName)
            ?.questions || []),
        ]);
        categorySelection.style.display = "none";
        questionContainer.style.display = "block";
        submitButton.style.display = "block";
        currentQuestionIndex = 0; // Reset question index when a new category is selected
        loadQuestion();
      });
    });
  }

  function loadQuestion() {
    if (
      currentCategoryQuestions &&
      currentQuestionIndex < currentCategoryQuestions.length
    ) {
      const questionObj = currentCategoryQuestions[currentQuestionIndex];
      questionElement.textContent = questionObj.question;
      optionsContainer.innerHTML = "";

      // Create a new array with the correct answer and incorrect options
      const allOptions = [...questionObj.options];
      const correctAnswer = questionObj.answer;

      // Shuffle the options
      const shuffledOptions = shuffleArray(allOptions);

      shuffledOptions.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => selectOption(option));
        optionsContainer.appendChild(button);
      });

      feedbackElement.textContent = "";
      submitButton.style.display = "block";
      nextButton.style.display = "none";
      selectedAnswer = null;
      optionsContainer.querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("correct-answer");
        btn.classList.remove("incorrect-answer");
        btn.classList.remove("selected");
      });
    } else {
      endQuiz();
    }
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
        currentCategoryQuestions &&
        currentQuestionIndex < currentCategoryQuestions.length
      ) {
        const currentQuestion = currentCategoryQuestions[currentQuestionIndex];
        const answerButtons = Array.from(optionsContainer.children);
        const correctAnswerButton = answerButtons.find(
          (btn) => btn.textContent === currentQuestion.answer
        );
        const selectedAnswerButton = answerButtons.find(
          (btn) => btn.textContent === selectedAnswer
        );

        if (selectedAnswer === currentQuestion.answer) {
          feedbackElement.textContent = "Correct! 🎉";
          feedbackElement.className = "correct";
          if (correctAnswerButton) {
            correctAnswerButton.classList.add("correct-answer");
          }
        } else {
          feedbackElement.textContent = `Incorrect. 😔 The correct answer is: ${currentQuestion.answer}`;
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
      feedbackElement.textContent = "Please select an answer. 🤔";
      feedbackElement.className = "incorrect";
    }
  });

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    loadQuestion();
  });

  function endQuiz() {
    quizContainer.innerHTML = `
            <h1>Quiz Ended! 🏆</h1>
            <p>You have completed the ${currentCategoryName} quiz! 👋</p>
            <button onclick="location.reload()">Play Again? 🔄</button>
        `;
  }

  loadQuestions();
});
