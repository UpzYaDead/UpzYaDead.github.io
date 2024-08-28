// Define the HTML elements

const board = document.getElementById('game-board');
const gridSize = 20;

const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');

const scoreText = document.getElementById('score');
const highScoreText = document.getElementById('high-score');
let highScore = 0;

let prev_direction = "right";

// Define the game variables
let snake = [{x: 10, y: 10}];

let direction = 'right';
let gameSpeedDelay = 200;
let gameInterval;
// Only if there is a collision, then we generate a new food position
let food_position = generateFoodPosition();
let gameStarted = false;
// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
}

// Draw snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

function generateFoodPosition(){
    let food_position
    done = false
    // Check if not in collision with the snake
    while (!done){
        pos = {
            x: Math.floor(Math.random() * gridSize + 1),
            y: Math.floor(Math.random() * gridSize + 1)
    }
    if (!snake.includes(food_position)){
        done = true;
        food_position = pos
    }
  
    // Check if not in collision with the snake

    return food_position
    }
}

function drawFood(){
    const foodElement = createGameElement('div', 'food');
    // Set the position of the food, it cannot be any of the snake segments
    // Create a random position and check if it is not in the snake
    setPosition(foodElement, food_position);
    board.appendChild(foodElement);
}


// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


// Set the position of the snake or food cube/div
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
    board.appendChild(element);
}


// Make the move mechanics here
function move(){
    // Just make a copy of the head of the snake
    const head = { ...snake[0] };
    console.log("We make a move");

    // Make sure that you cannot move opposite of the current direction
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    // append the new head to the beginning of the array
    snake.unshift(head);
    // remove the last element of the snake to give the illusion of movement
    // If the snake ate the food, it should grow. So we do not remove the last element.
    if (head.x === food_position.x && head.y === food_position.y) {
        // The snake has eaten the food
        // Do not remove the last element
        food_position = generateFoodPosition();
        drawFood(); 
        clearInterval(gameInterval);
        updateScore();
        changeGameSpeed();
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
    snake.pop();
    }
}


function checkCollision(){
    // Check for a collision with the border, or with itself.
    if (snake[0].x < 1 || snake[0].x > gridSize || snake[0].y < 1 || snake[0].y > gridSize) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver();
        }
    }

}


function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    food_position = generateFoodPosition();
    draw();
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();        
        
    }, gameSpeedDelay);
}



// keypress listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || 
    ((!gameStarted && event.code === ' ') )) {
        console.log("Game has started");
        startGame();
    } else {
        prev_direction = direction;
        switch (event.key) {
            case 'ArrowUp':
                if (prev_direction !== 'down'){
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (prev_direction !== 'up'){
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (prev_direction !== 'right'){
                    direction = 'left';
                }
                break;
            case 'ArrowRight':  
                if (prev_direction !== 'left'){
                    direction = 'right';
                }
                break;  
        }
        console.log("Direction is: ", direction);
        console.log("Previous direction is: ", prev_direction);
        
    }
}

document.addEventListener('keydown', handleKeyPress)


function stopGame(){
    //Clear the interval and set the variables, and clear the board from all div's
    console.log("Game has stopped");
    updateHighScore();
    resetScore();
    gameStarted = false;
    instructionText.innerText = 'Game Over! Press Space to restart';
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}


function gameOver(){
    board.innerHTML = '';
    clearInterval(gameInterval); // Clear the interval
    stopGame();
    snake = [{x: 10, y: 10}];
    direction = 'right';
    gameSpeedDelay = 200;
    snake = [{x: 10, y: 10}];
    food_position = [{x : 10, y : 10}];
}


// Update the score

function updateScore(){
    // Update the score
    const currentscore = snake.length - 1; 
    scoreText.textContent = currentscore.toString().padStart(3, '0');
}   

function resetScore(){
    // Reset the score
    scoreText.textContent = '000';
}

function updateHighScore(){
    // Update the high score
    if (snake.length - 1 > highScore){
        highScore = snake.length - 1;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
}


function changeGameSpeed(){
    // Change the game speed
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 10;
    } else if (gameSpeedDelay > 125) {
        gameSpeedDelay -= 7;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 75) {
        gameSpeedDelay -= 3;
    }
    else {
        gameSpeedDelay -= 2;
    }


}


// Functionality of not being able to go back to the opposite direction, this is something to add later.
// Also, figure out why there are two gameIntrevals running at the same time., 


