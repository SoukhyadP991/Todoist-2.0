// Select DOM elements
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressValue = document.getElementById('progress-value');
const prioritySelector = document.getElementById('priority-selector');
const statusMessage = document.getElementById('status-message');
const searchInput = document.getElementById('search-input'); // New search input field
let tasks = [];
let draggedIndex = null;

// Array of motivational messages
const motivationalMessages = [
    "You're doing great! Keep it up!",
    "One task at a time, you'll get there!",
    "Focus on progress, not perfection!",
    "Believe in yourself and keep pushing!",
    "Stay positive! You're closer than you think!",
    "Every step counts, keep going!",
    "You've got this! Don't stop now!",
    "Keep striving for greatness!",
    "Stay focused! You're on the right track!",
    "Success is a series of small wins!",
];

// Load tasks from localStorage (if any)
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks); // Parse the stored tasks string into an array
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the tasks as a string in localStorage
}

// Function to add task
function addTask() {
    const taskText = newTaskInput.value.trim();
    const taskPriority = prioritySelector.value;
    if (taskText) {
        const task = {
            text: taskText,
            completed: false,
            priority: taskPriority,
        };
        tasks.push(task);
        newTaskInput.value = ''; // Clear the input field
        saveTasks(); // Save updated tasks to localStorage
        renderTasks(); // Re-render the task list
    }
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = ''; // Clear the existing task list
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);
        li.innerHTML = `
            <div class="checkbox-container" draggable="true" ondragstart="drag(event, ${index})">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span>${task.text}</span>
                <div class="priority-dot priority-${task.priority.toLowerCase()}"></div>
            </div>
            <button class="edit-btn" onclick="editTask(${index})">✎</button>
            <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
        `;
        taskList.appendChild(li); // Append the new task to the list
    });
    updateProgress(); // Update the progress bar and message
    highlightSearchResults(); // Highlight search results (if any)
}

// Function to edit a task
function editTask(index) {
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText; // Update the task text
        saveTasks(); // Save updated tasks to localStorage
        renderTasks(); // Re-render the task list
    }
}

// Function to toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed; // Toggle the completed status
    saveTasks(); // Save updated tasks to localStorage
    renderTasks(); // Re-render the task list
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1); // Remove the task from the array
    saveTasks(); // Save updated tasks to localStorage
    renderTasks(); // Re-render the task list
}

// Function to update progress
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length; // Count completed tasks
    const totalTasks = tasks.length; // Total number of tasks
    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100; // Calculate progress
    progressValue.textContent = `${Math.round(progressPercentage)}%`; // Update progress display
    const strokeDasharray = `${progressPercentage}, 100`; // Update stroke for the progress bar
    progressBar.style.strokeDasharray = strokeDasharray;

    // Update status message based on task completion
    if (completedTasks === totalTasks && totalTasks > 0) {
        statusMessage.textContent = "Great job! You've completed all tasks!";
        // Trigger confetti
        confetti();
    } else if (totalTasks === 0) {
        statusMessage.textContent = "Keep adding tasks to accomplish more!";
    } else {
        // Select a random motivational message
        const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
        statusMessage.textContent = motivationalMessages[randomIndex];
    }
}

// Event listener for adding tasks
addTaskBtn.addEventListener('click', addTask);

// Function to highlight search results
function highlightSearchResults() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const taskItems = taskList.querySelectorAll('li');
    
    // Remove any existing "beat" animations from all tasks
    taskItems.forEach(taskItem => {
        taskItem.classList.remove('search-highlight', 'beat');
    });

    // Apply the highlight and beat animation only when there's a search term
    if (searchTerm.length > 0) {
        taskItems.forEach(taskItem => {
            const taskText = taskItem.querySelector('span').textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                taskItem.classList.add('search-highlight'); // Add highlight class
                taskItem.classList.add('beat'); // Add the "beat" animation
            }
        });
    }
}

// Event listener for search input
searchInput.addEventListener('input', highlightSearchResults);

// Drag and drop functions
function drag(event, index) {
    draggedIndex = index; // Store the index of the dragged task
}

taskList.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow dropping by preventing default behavior
});

taskList.addEventListener('drop', (event) => {
    const targetIndex = Array.from(taskList.children).indexOf(event.target.closest('li')); // Get the index of the target task
    if (draggedIndex !== null && targetIndex !== -1 && draggedIndex !== targetIndex) {
        const draggedTask = tasks[draggedIndex]; // Get the dragged task
        tasks.splice(draggedIndex, 1); // Remove the dragged task from its original position
        tasks.splice(targetIndex, 0, draggedTask); // Insert the dragged task at the new position
        saveTasks(); // Save updated tasks to localStorage
        renderTasks(); // Re-render the task list
    }
});

// Initialize the app
loadTasks(); // Load tasks from localStorage on page load
renderTasks(); // Render tasks on page load
