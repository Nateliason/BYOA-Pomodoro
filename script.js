let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const modeToggleButton = document.getElementById('mode-toggle');

const WORK_TIME = 25 * 60; // 30 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerId !== null) return;
    
    timeLeft = timeLeft || (isWorkTime ? WORK_TIME : BREAK_TIME);
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
            updateDisplay(timeLeft);
            
            // Play notification sound
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
            
            statusText.textContent = isWorkTime ? 'Time to focus!' : 'Take a break!';
        }
    }, 1000);
    
    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
    statusText.textContent = 'Time to focus!';
    modeToggleButton.classList.remove('work-mode', 'rest-mode');
    modeToggleButton.classList.add('work-mode');
}

function toggleTimer() {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    updateDisplay(timeLeft);
    
    statusText.textContent = isWorkTime ? 'Time to focus!' : 'Take a break!';
    
    modeToggleButton.classList.remove('work-mode', 'rest-mode');
    modeToggleButton.classList.add(isWorkTime ? 'work-mode' : 'rest-mode');
    
    // Reset the timer state
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
}

startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);

// Initialize display
updateDisplay(WORK_TIME); 

modeToggleButton.classList.add('work-mode'); // Set initial button style 