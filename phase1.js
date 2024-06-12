'use strict';

let startTime = 0;
let totalTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
let finalSpeed = 0;
let lastSpeed = 0;
let peakSpeed = 0
let timeToPeakSpeed = 0;
let previousSpeed = 0;
let previousTime = 0;
let isDragging = false;
let lastAcceleration = 0;
let averageAcceleration = 0;
let initialX = 0;
let initialY = 0;
let previousChangeInSpeed = 0;
let modal = document.getElementById('resultsModal');
let modalContent = document.getElementById('modalBodyContent');
let results = null;
let reachedTarget = false;
let totalDistanceTraveled = 0;

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetInnerDot');
//const targetInnerDot = document.getElementById('targetInnerDot');

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

console.log(`Viewport width: ${screenWidth}px`);
console.log(`Viewport height: ${screenHeight}px`);


// At the touch start
document.addEventListener("touchstart", e => {
    //Getting the current date at the start of the touch event
    //if (e.target === startPoint) {
    if (modal.style.display == 'block') { return; }

    //Get the first touch event
    const touch = e.changedTouches[0];
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;

    startTime = Date.now();

    // Create pointer to display a visual representation of where the finger is at any point
    const pointer = document.createElement("div")
    pointer.classList.add("dot")
    pointer.style.top = `${touchStartY}px`
    pointer.style.left = `${touchStartX}px`
    pointer.id = touch.identifier

    document.body.append(pointer);
    previousTime = startTime; //Set previous time to start time
    initialX = touchStartX; //Store touch start x in another variable
    initialY = touchStartY; //Store touch start y in another variable
    totalDistanceTraveled = 0; //Distance is currently zero
    //}
});


//Finger is moving on the screen
document.addEventListener("touchmove", e => {
    e.preventDefault();
    if (modal.style.display == 'block') { return; }

    isDragging = true; //Turn on flag when finger moves on the screen

    const touch = e.changedTouches[0];
    let currentX = touch.pageX; //Store current x location as finger is moving
    let currentY = touch.pageY; //Store current y location as finger is moving
    let currentTime = Date.now();

    // Visual representation of where the finger is at any point
    const pointer = document.getElementById(touch.identifier)
    pointer.style.top = `${touch.pageY}px`
    pointer.style.left = `${touch.pageX}px`


    //Calculate distance from the last point
    let changeInDistance = calculateDistance(initialX, currentX, initialY, currentY);

    //This reflects the actual path taken by the user's finger across the touch surface. It is different from the straight line distance
    totalDistanceTraveled += changeInDistance;

    let changeInTime = currentTime - previousTime; //Change in time

    let changeInSpeed = changeInDistance / changeInTime; //Change in speed with respect to time

    // This is a measure of how quickly or slowly the touch speeds up or slows down at a specific moment in time.
    let instantaneousAcceleration = (changeInSpeed - previousChangeInSpeed) / changeInTime;

    lastAcceleration = instantaneousAcceleration; // Last recorded acceleration of a touch movement on the screen.

    let totalTimeTakenForTouchMove = currentTime - startTime; // This reflects the time from start of the touch event to the currrent time

    finalSpeed = totalDistanceTraveled / totalTimeTakenForTouchMove; // This represents the final speed during the touch movement

    lastSpeed = finalSpeed; // This represents the last recorded final speed in the touch movement

    // Getting the peak speed here
    if (finalSpeed > peakSpeed) {
        peakSpeed = finalSpeed;
        timeToPeakSpeed = currentTime - startTime;
    }

    /*Check This Block to know if it can also work for average acceleration and what it means */
    //Average acceleration (final velocity - initial velocity)/ (final time -initial time)
    //let acceleration = (finalSpeed - previousSpeed) / (totalTimeTakenForTouchMove);
    //averageAcceleration = acceleration;
    //console.log(` acceleration: ${acceleration.toFixed(9)}`);

    previousSpeed = finalSpeed; //Update speed for the next move
    previousTime = currentTime; //update time for the next move
    initialX = currentX; //update start position for the next move
    initialY = currentY; //update start position for the next move
    previousChangeInSpeed = changeInSpeed; //update  speed for the next move

});


//Finger leaves the screen
document.addEventListener("touchend", e => {
    if (modal.style.display == 'block') { return; }

    const touch = e.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;
    const pointer = document.getElementById(touch.identifier);
    pointer.remove();

    //Calculating the straight line distance covered from start to target point
    const straightLineDistance = calculateDistance(touchStartX, touchEndX, touchStartY, touchEndY);

    // Calculating total duration
    if (startTime !== 0) {
        totalTime = calculateTotalTime(startTime);
    }

    //Calculating the average drag speed (TotalDistance/ Total Time)
    const averageDragSpeed = calculateDragSpeed(totalDistanceTraveled, totalTime);

    //Average acceleration (final velocity - initial velocity)/ (final time -initial time) 
    //This is a measure of how quickly or slowly the touch speeds up or slows down across the entire period of the task
    let averageAcceleration = (finalSpeed - 0) / (totalTime);

    let tapDuration = isDragging ? null : totalTime; //Show tapDuration if a tap occurred

    //This captures the rectangular area defined by the start and end points of a touch gesture on the screen. 
    let tapAreaSize = Math.abs(touchStartX - touchEndX) * Math.abs(touchStartY - touchEndY);

    let startRect = startPoint.getBoundingClientRect();
    let targetRect = targetPoint.getBoundingClientRect();

    let startX = startRect.left + startRect.width / 2;
    let startY = startRect.top + startRect.height / 2;

    let targetX = targetRect.left + targetRect.width / 2;
    let targetY = targetRect.top + targetRect.height / 2;
    let shortestPathDistance = calculateDistance(startX, targetX, startY, targetY); // The shortest path to follow from start to target

    // || document.elementFromPoint(touch.clientX, touch.clientY) === targetInnerDot

    if (document.elementFromPoint(touch.clientX, touch.clientY) === targetInnerDot) {
        reachedTarget = true;
    }
    results = `Target Reached: ${reachedTarget}
    Total Drag Distance: ${totalDistanceTraveled.toFixed(2)} pixels
    Total Duration: ${totalTime} ms`;

    const lines = results.split('\n');
    const resultObj = {};

    lines.forEach(line => {
        const [key, value] = line.split(':').map(str => str.trim());
        if (key && value) {
            if (value.includes('pixels')) {
                resultObj[key] = parseFloat(value);
            } else if (value.includes('ms')) {
                resultObj[key] = parseInt(value);
            } else if (value === 'true' || value === 'false') {
                resultObj[key] = value === 'true';
            } else {
                resultObj[key] = value;
            }
        }
    });

    const resultsStringify = JSON.stringify(resultObj);


    // results = `Target reached: ${reachedTarget}
    // Tap duration: ${tapDuration !== null ? tapDuration : 'Not a tap'} ms
    // Straight line drag distance: ${straightLineDistance.toFixed(2)} px
    // Total Drag distance: ${totalDistanceTraveled.toFixed(2)} pixels
    // Total duration: ${totalTime} ms
    // Average drag speed: ${averageDragSpeed.toFixed(2)} px/ms
    // Last speed: ${lastSpeed.toFixed(2)} px/ms
    // Peak speed: ${peakSpeed.toFixed(2)} px/ms
    // Time to peak speed: ${timeToPeakSpeed} ms
    // Last acceleration: ${lastAcceleration.toFixed(8)} ms^2
    // Average acceleration: ${averageAcceleration.toFixed(8)} ms^2
    // Tap area: ${tapAreaSize.toFixed(2)} px^2
    // Shortest Path Distance: ${shortestPathDistance.toFixed(2)} px `;

    isDragging = false;
    reachedTarget = false;
    modalContent.innerText = results;
    modal.style.display = 'block'
    if (sessionStorage.getItem('player1') == 'true' && !sessionStorage.getItem('resultsP1')) {
        sessionStorage.setItem('resultsP1', resultsStringify);
    }
    if (sessionStorage.getItem('player2') == 'true' && !sessionStorage.getItem('resultsP2')) {
        sessionStorage.setItem('resultsP2', resultsStringify);
    }
    // sessionStorage.setItem('results', results);
});

// Function to calculate drag distance covered
function calculateDistance(x1, x2, y1, y2) {
    const disX = x2 - x1;
    const disY = y2 - y1;
    return Math.sqrt(
        Math.pow(disX, 2) + Math.pow(disY, 2)
    );
}

// Function to calculate tap duration
function calculateTotalTime(startTime) {
    const endTime = Date.now();
    return (endTime - startTime);

}

// Function to calculate drag speed
function calculateDragSpeed(distance, duration) {
    return (distance / duration);
}
function getShortestPathDistance() {
    let startRect = startPoint.getBoundingClientRect();
    let targetRect = targetPoint.getBoundingClientRect();

    let startX = startRect.left + startRect.width / 2;
    let startY = startRect.top + startRect.height / 2;

    let targetX = targetRect.left + targetRect.width / 2;
    let targetY = targetRect.top + targetRect.height / 2;

    let dx = targetX - startX;
    let dy = targetY - startY;

    return Math.sqrt(dx * dx + dy * dy);
}
function closeModal() {
    modal.style.display = 'none';
    window.location.href = "index.html";
}


/* ---NOTES---

* if (modal.style.display == 'block') { return; } ===> to prevent from overwriting original (last) values when attempting to close the modal
*
*
*

---END NOTES--- */