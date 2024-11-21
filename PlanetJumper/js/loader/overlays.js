"use strict";

/* game over screen - START */


// overlay.js
export function gameOver() {
    // Create the Game Over screen container
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'gameOverScreen';
    gameOverScreen.style.display = 'none'; // Initially hidden
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.background = 'rgba(0, 0, 0, 0.8)';
    gameOverScreen.style.color = 'white';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.zIndex = '1000';

    // Create the content inside the Game Over screen
    const gameOverText = document.createElement('div');
    gameOverText.id = 'gameOverText';
    gameOverText.style.textAlign = 'center';

    // Add a message
    const h1 = document.createElement('h1');
    h1.innerText = 'Game Over';
    gameOverText.appendChild(h1);

    // game over message
    const scoreText = document.createElement('p');
    scoreText.innerText = 'Your IQ must be below average for teleporting into a 5600 Celsius lava ball';
    gameOverText.appendChild(scoreText);

    // restart button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '18px';
    restartButton.style.cursor = 'pointer';
    restartButton.onclick = restartGame; // Call restart function on click
    gameOverText.appendChild(restartButton);

    // Append the content to the Game Over screen
    gameOverScreen.appendChild(gameOverText);

    // Append the Game Over screen to the body
    document.body.appendChild(gameOverScreen);

    // Function to show the Game Over screen
    function showGameOverScreen() {
        gameOverScreen.style.display = 'flex'; // Show the screen
    }

    // Function to hide the Game Over screen and restart the game
    function restartGame() {
        gameOverScreen.style.display = 'none'; // Hide the game over screen (unnecesearry as we just reload the page)
        console.log("Game restarting");
        window.location.reload()
    }

    showGameOverScreen(); // Trigger game over screen visibility
}


/**  game over screen - END */