# Flappy Bird Practice Project

## Overview

This is a **practice project** created to explore and improve skills in **HTML, CSS, and JavaScript**. The project is a simple recreation of the popular **Flappy Bird** game with some improvements like:

* Level system
* Score tracking
* Pipe interval variation
* Custom background, sounds, and image support

## Features

* Start screen and game over screen
* Score and level display
* Increasing difficulty as levels progress
* Fun sound effects
* Option to use a custom **image** instead of the bird

## How to Run

1. Clone or download the project.
2. Open `index.html` in your browser.
3. Click **Start Game** or press the **Spacebar** to begin.

## Switching Between Bird and Custom Image

In `script.js`, the drawing of the player is controlled by two functions:

* **Bird (default yellow circle):**

  ```js
  // Inside gameLoop()
  bird.draw();
  // drawImg(); (comment this out)
  ```

* **Custom Image (e.g., rajini.png):**

  ```js
  // Inside gameLoop()
  // bird.draw(); (comment this out)
  drawImg();
  ```

Change these lines inside the **gameLoop()** function depending on whether you want to see the bird or the image on the screen.

## Note

* This is **not a polished game**, but a fun project for understanding canvas, game loops, and basic interactivity.
* Sounds and images can be replaced with your own files for practice.

---

## Disclaimer

This project is made purely for educational practice. It does not claim ownership of the original Flappy Bird concept. All credits to the original creators of Flappy Bird.

No harm or offense is intended by the use of images, sounds, or names included in this practice project.