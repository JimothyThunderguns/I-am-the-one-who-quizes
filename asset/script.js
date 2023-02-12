//QUESTIONS
const questions = [ 
    {
        questionText: "Question 1: Arrays in Javascript can be used to store _______",
        options:  [
        "1: Numbers and Strings",
        "2: Other Arrays",
        "3: Booleans",
        "4: All of the above",
        ],
    answer: "4: All of the above",
}, 

{
    questionText: "Question 2: String Values must be enclosed in ___ when being assigned to variables",
    options:  [
        "1: Quotes",
        "2: Curly Brackets",
        "3: Parentheses",
        "4: Commas",
        ],
    answer: "1: Quotes",
}, 

    
{
    questionText: "Question 3: What useful tool is used for development/debugging by printing it?",
    options:  [
        "1: Your terminal ",
        "2: console.log",
        "3: if/else statements",
        "4: A Toyota Corolla S",
        ],
    answer: "2: console.log",
}, 


{
    questionText: "Question 4: Common data types DO NOT include",
    options:  [
        "1: Strings",
        "2: Numbers",
        "3: Booleans",
        "4: Alerts",
        ],
    answer: "4: Alerts",
}, 


{
    questionText: "Question 5: Which statement can be used to terminate a loop, switch or label?",
    options:  [
        "1: exit",
        "2: end",
        "3: break",
        "4: quit it",
        ],
    answer: "3: break",
}, 

{
    questionText: "Question 6: What statement is for executing code that is true?",
    options:  [
        "1: if/else",
        "2: for loop",
        "3: Javascript",
        "4: while loop",
        ],
    answer: "1: if/else",
}, 
];


// card divs

const startCard = document.querySelector('#start-card');
const questionCard = document.querySelector('#question-card');
const scoreCard = document.querySelector('#score-card');
const scoreboardCard = document.querySelector('#scoreboard-card');

//the function to hide each card
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  scoreboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

//hide the result div
function hideResults() {
  resultDiv.style.display = "none";
}

//global variables
var intervalID;
var time;
var currentQuestion; 

//event listener for when the quiz is started
document.querySelector("#start-button").addEventListener("click", startQuiz)

//startQuiz function
function startQuiz() {
  //hides any visible cards upon start
  hideCards();
  //reveals the question card
  questionCard.removeAttribute("hidden")

  //assign 0 to the first question so that when it's clicked it works right and displays
  currentQuestion = 0;
  displayQuestion();

  //this will set the time based on how many questions I put in. I could make this a 100 question quiz and it'll adjust
  time = questions.length * 10;

  //executes countdown every 1000ms (1 second) and displays it on the page
  intervalID = setInterval(countdown, 1000);

  //displays the time when it starts
  displayTime();
}

//countdown function
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}
//display the time onsite
const timeDisplay = document.querySelector("#time");
  function displayTime() {
    timeDisplay.textContent = time;
  }

//displays the questions
  function displayQuestion() {
let question = questions[currentQuestion];
let options = question.options;

let questionElement = document.querySelector("#question-text");

questionElement.textContent = question.questionText;

//renders the options for each question
for (let i = 0; i < options.length; i++) {
  let option = options[i];
  let optionButton = document.querySelector("#option" + i);
  optionButton.textContent = option;
}
}


//event listener for the options that shows if it's correct or not
document.querySelector ("#quiz-options").addEventListener("click", checkAnswer);

//checks  if the option is 
function correctOption(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}

//penalty for incorrect answers

function checkAnswer(eventObject) {
  let optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (correctOption(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResults, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResults, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      //if time is less than 10, display time as 0 and end quiz
      //time is set to zero in this case to avoid displaying a negative number in cases where a wrong answer is submitted with < 10 seconds left on the timer
      time = 0;
      displayTime();
      endQuiz();
    }
  }
  
  //increment current question by 1 
  currentQuestion++;

  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

//scorecard display
const score = document.querySelector("#score");

//hiding the other cards and displaying your score when the quiz is done
function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

//initials and submit button constants
const submitButton = document.querySelector("#submit-button")
const inputElement = document.querySelector("#initials");

//stores the input and score on click
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //prevent default 
  event.preventDefault();

  if (!inputElement.value) {
    alert("Enter your initials, pal!");
    return;
  }

//store the score aand initials
let scoreboardItem = {
  initials: inputElement.value,
  score: time,
  };

updateScoreboard(scoreboardItem)

//hide the question card
hideCards();
scoreboardCard.removeAttribute("hidden");

  renderScoreboard();
}

function updateScoreboard(scoreboardItem) {
  let scoreboardArray = getScoreboard();

  scoreboardArray.push(scoreboardItem);
  localStorage.setItem("scoreboardArray", JSON.stringify(scoreboardArray));
  }

  //get the scoreboardArray from local storage and parse it into a javescript object
function getScoreboard() {
  let storedScoreboard = localStorage.getItem("scoreboardArray");
  if (storedScoreboard !== null) {
    let scoreboardArray = JSON.parse(storedScoreboard);
    return scoreboardArray
  } else {
    scoreboardArray = [];
  }

  return scoreboardArray;
}

//display scoreboard on its card
function renderScoreboard() {
  let sortedScoreboardArray = sortScoreboard();
  const highscores = document.querySelector("#highscores");
  highscores.innerHTML= "";
  for (let i = 0; i < sortedScoreboardArray.length; i++) {
    let scoreboardEntry = sortedScoreboardArray[i];
    let newListItem = sortedScoreboardArray("li");
      newListItem.textContent = scoreboardEntry.initials + " - " + scoreboardEntry.score
  highscores.append(newListItem);  
  }
}

//sort the scoreboard
function sortScoreboard() {
  let scoreboardArray = getScoreboard();
  if (!scoreboardArray) {
    return;
  }

scoreboardArray.sort (function (a, b) {
  return b.score - a.score;
});
  return scoreboardArray;
  }


//button for clearing the scoreboard
const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearScoreboard);

//function that clears the local storage
function clearScoreboard() {
  localStorage.clear();
  renderScoreboard();
}

//back button
const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnHome);

//hides the scoreboard and takes you home
function returnHome() {
  hideCards();
  startCard.removeAttribute("hidden");
}

//link to scoreboard from any point
const scoreboardLink = document.querySelector("#scoreboard-link");
scoreboardLink.addEventListener("click", showScoreboard);

function showScoreboard() {
    hideCards();
    scoreboardCard.removeAttribute("hidden");
//stops the countdown
    clearInterval(intervalID);

    time = undefined;
    displayTime();

    renderScoreboard();
}