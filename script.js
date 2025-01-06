let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const modeToggleButton = document.getElementById('mode-toggle');
const addTimeButton = document.getElementById('add-time');
const focusPrompt = document.getElementById('focus-prompt');
const focusInput = document.getElementById('focus-input');
const focusSubmit = document.getElementById('focus-submit');
const focusDisplay = document.getElementById('focus-display');

const WORK_TIME = 25 * 60; // 30 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display elements
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title
    document.title = `${timeString} - Pomodoro Timer`;
}

function startTimer() {
    if (timerId !== null) return;
    
    if (isWorkTime && !focusDisplay.textContent) {
        focusPrompt.classList.remove('hidden');
        return;
    }
    
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
            
            if (!isWorkTime) {
                focusDisplay.classList.add('hidden');
                focusDisplay.textContent = '';
            }
            
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
    addTimeButton.disabled = true;
    focusDisplay.classList.add('hidden');
    focusDisplay.textContent = '';
}

function toggleTimer() {
    if (timerId === null) {
        startTimer();
        addTimeButton.disabled = false;
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        addTimeButton.disabled = true;
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

function addFiveMinutes() {
    if (timerId !== null) {
        timeLeft += 5 * 60; // Add 5 minutes in seconds
        updateDisplay(timeLeft);
    }
}

startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);
addTimeButton.addEventListener('click', addFiveMinutes);

focusSubmit.addEventListener('click', () => {
    const focusText = focusInput.value.trim();
    if (focusText) {
        focusDisplay.textContent = `Focusing on: ${focusText}`;
        focusDisplay.classList.remove('hidden');
        focusPrompt.classList.add('hidden');
        focusInput.value = '';
        startTimer();
    }
});

// Initialize display
updateDisplay(WORK_TIME); 

modeToggleButton.classList.add('work-mode'); // Set initial button style 