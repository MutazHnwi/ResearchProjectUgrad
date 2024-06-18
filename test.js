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
let end = 0;

const startPoint = document.getElementById('startInnerDot');
const checkpoint1 = document.getElementById('checkpoint1Inner');
const checkpointA = document.getElementById('checkpointAInner');
const targetPoint = document.getElementById('targetInnerDot');
const checkpoints = [startPoint, checkpoint1, checkpointA, targetPoint];
let phase = 0; // index of checkpoints representing the next point to go to

const coords = [];
let numCoords = 0;

// subMovements[i] = [x coord of i, y coord of i, current time, current time - previous sm time , current sm coord - previous sm coord];
const subMovements = []
let numSubMovements = 0;
//const targetInnerDot = document.getElementById('targetInnerDot');

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

console.log(`Viewport width: ${screenWidth}px`);
console.log(`Viewport height: ${screenHeight}px`);

function createSubDot() {
    let dot = document.createElement('span');
    dot.className = 'subdot';
    let currX = 0;
    let currY = 0;
    if (numCoords === 0 || end === 1) {
        currX = coords[numCoords][0];
        currY = coords[numCoords][1];
    }
    else {
        currX = coords[numCoords - 1][0];
        currY = coords[numCoords - 1][1];
    }
    dot.style.position = 'absolute';
    dot.style.top = currY.toString() + 'px';
    dot.style.left = currX.toString() + 'px';
    document.body.appendChild(dot);
}

// At the touch start
document.addEventListener("touchstart", e => {
    //Getting the current date at the start of the touch event
    //if (e.target === startPoint) {

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
    subMovements[numSubMovements] = [initialX, initialY, previousTime, 0, 0];
    numSubMovements = numSubMovements + 1;
    coords[numCoords] = [initialX, initialY, previousTime];
    createSubDot();
    numCoords = numCoords + 1;
    //}
});

function enterSubMovement() {
    let subTimeDiff = coords[numCoords][2] - subMovements[numSubMovements - 1][2];
    let subDistDiff = calculateDistance(coords[numCoords][0], subMovements[numSubMovements - 1][0], coords[numCoords][1], subMovements[numSubMovements - 1][1]);
    subMovements[numSubMovements] = [coords[numCoords][0], coords[numCoords][1], coords[numCoords][2], subTimeDiff, subDistDiff];
    numSubMovements = numSubMovements + 1;
}

function createTrail() {
    let dot = document.createElement('span');
    dot.className = 'traildot';
    let currX = coords[numCoords][0];
    let currY = coords[numCoords][1];
    dot.style.position = 'absolute';
    dot.style.top = currY.toString() + 'px';
    dot.style.left = currX.toString() + 'px';
    document.body.appendChild(dot);
}

function isSubMovement() {
    if (numCoords > 1) {
        let x0 = coords[numCoords - 2][0];
        let x1 = coords[numCoords - 1][0];
        let x2 = coords[numCoords][0];
        let y0 = coords[numCoords - 2][1];
        let y1 = coords[numCoords - 1][1];
        let y2 = coords[numCoords][1];

        if (x0 < x1 && x1 < x2) {
            if (y0 == y1 && y1 == y2) {
                createTrail();
            }
            else if (y0 < y1 && y1 < y2) {
                createTrail();
            }
            else if (y0 > y1 && y1 > y2) {
                createTrail();
            }
            else {

                enterSubMovement();
                createSubDot();
            }
        }

        else if (x0 > x1 && x1 > x2) {
            if (y0 == y1 && y1 == y2) {
                createTrail();
            }
            else if (y0 < y1 && y1 < y2) {
                createTrail();
            }
            else if (y0 > y1 && y1 > y2) {
                createTrail();
            }
            else {
                enterSubMovement();
                createSubDot();
            }
        }

        else if (x0 == x1 && x1 == x2) {
            if (y0 == y1 && y1 == y2) {
                createTrail();
            }
            else if (y0 < y1 && y1 < y2) {
                createTrail();
            }
            else if (y0 > y1 && y1 > y2) {
                createTrail();
            }
            else {
                enterSubMovement();
                createSubDot();
            }
        }

        else {
            enterSubMovement();
            createSubDot();
        }
    }
}

//Finger is moving on the screen
document.addEventListener("touchmove", e => {
    e.preventDefault();

    isDragging = true; //Turn on flag when finger moves on the screen

    const touch = e.changedTouches[0];
    let currentX = touch.pageX; //Store current x location as finger is moving
    let currentY = touch.pageY; //Store current y location as finger is moving
    let currentTime = Date.now();
    let currentElements = document.elementsFromPoint(currentX, currentY);

    if (currentElements.includes(checkpoints[phase])) {
	phase++;
    } else if (currentElements.includes(checkpoints[phase + 1])) {
	modalContent.innerText = `Incorrect, phase = ${phase}`;
	modal.style.display = 'block';
    }

    coords[numCoords] = [currentX, currentY, currentTime];
    isSubMovement();
    numCoords = numCoords + 1;

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

    const touch = e.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;
    let currentTime = Date.now();
    let subTimeDiff = currentTime - subMovements[numSubMovements - 1][2];
    let subDistDiff = calculateDistance(touchEndX, subMovements[numSubMovements - 1][0], touchEndY, subMovements[numSubMovements - 1][1]);
    subMovements[numSubMovements] = [touchEndX, touchEndY, currentTime, subTimeDiff, subDistDiff];
    numSubMovements = numSubMovements + 1;
    coords[numCoords] = [touchEndX, touchEndY, currentTime];
    end = 1;
    createSubDot();
    numCoords = numCoords + 1;
    console.log("end");


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

    subMovements.forEach((el) => {
        console.log(el);
    })

    results = `Number of Submovements: ${numSubMovements}
    Number of movements: ${numCoords}`;

    modalContent.innerText = results;
    modal.style.display = 'block'
    isDragging = false;
    reachedTarget = false;
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
}
