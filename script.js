let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;
let selectedCourse = null;
let questions = [];

// Function to start the quiz
function startQuiz() {
    document.querySelector('.homepage').style.display = 'none';
    document.querySelector('.course-selection').style.display = 'block';
    loadCourses();
}

// Function to load available courses
function loadCourses() {
    fetch('courses.json')
        .then(response => response.json())
        .then(courses => {
            const courseList = document.getElementById('course-list');
            courses.forEach(course => {
                const button = document.createElement('button');
                button.innerText = course.name;
                button.onclick = () => selectCourse(course);
                courseList.appendChild(button);
            });
        });
}

// Function to select a course
function selectCourse(course) {
    selectedCourse = course;
    fetch(course.questionsFile)
        .then(response => response.json())
        .then(data => {
            questions = data;
            document.querySelector('.course-selection').style.display = 'none';
            document.querySelector('.quiz-container').style.display = 'block';
            showQuestion();
        });
}

// **הפעלת השאלה הראשונה**
showQuestion();

// פונקציה להצגת השאלה הנוכחית
function showQuestion() {
    clearInterval(timerInterval); // איפוס הטיימר
    timeLeft = 15; // חידוש זמן לכל שאלה
    document.getElementById("time-left").innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            disableAnswers();
        }
    }, 1000);

    const questionContainer = document.getElementById("question-text");
    const answersContainer = document.getElementById("answers-container");
    const nextButton = document.getElementById("next-button");

    nextButton.disabled = true; // השבתת כפתור "המשך" עד לבחירת תשובה
    answersContainer.innerHTML = ""; // ניקוי תשובות קודמות

    if (currentQuestionIndex >= questions.length) {
        questionContainer.innerHTML = `🎉 סיימת את החידון! הציון שלך: ${score}/${questions.length}`;
        document.getElementById("timer").style.display = "none";
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion["שאלה"];

    currentQuestion["תשובות"].forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer["תשובה"];
        button.classList.add("answer-button");
        button.addEventListener("click", () => selectAnswer(button, answer["נכונה"]));
        answersContainer.appendChild(button);
    });
}

// פונקציה לבדיקת תשובה
function selectAnswer(button, isCorrect) {
    clearInterval(timerInterval); // עצירת הטיימר כשמשתמש בוחר תשובה

    const allButtons = document.querySelectorAll(".answer-button");
    allButtons.forEach(btn => btn.disabled = true); // מניעת בחירה חוזרת

    if (isCorrect) {
        button.classList.add("correct");
        score++;
        document.getElementById("score-value").innerText = score;
    } else {
        button.classList.add("wrong");
    }

    document.getElementById("next-button").disabled = false; // הפעלת כפתור "המשך"
}

// מעבר לשאלה הבאה
document.getElementById("next-button").addEventListener("click", () => {
    currentQuestionIndex++;
    showQuestion();
});

// פונקציה לאיפוס החידון
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("score-value").innerText = score;
    document.getElementById("timer").style.display = "block";
    showQuestion();
}
