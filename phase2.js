'use strict';

// Variables for tracking touch events and results
let startTime = 0;
let totalTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
let isDragging = false;
let totalDistanceTraveled = 0;
let reachedTarget = false;
let newFeatureVal;

let modal = document.getElementById('resultsModal');
let modalContent = document.getElementById('modalBodyContent');

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetInnerDot');

// Event listener for touch start
document.addEventListener("touchstart", e => {
    if (modal.style.display == 'block') { return; }

    const touch = e.changedTouches[0];
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;

    startTime = Date.now();

    const pointer = document.createElement("div");
    pointer.classList.add("dot");
    pointer.style.top = `${touchStartY}px`;
    pointer.style.left = `${touchStartX}px`;
    pointer.id = touch.identifier;

    document.body.append(pointer);
    totalDistanceTraveled = 0;
});

// Event listener for touch move
document.addEventListener("touchmove", e => {
    e.preventDefault();
    if (modal.style.display == 'block') { return; }

    isDragging = true;

    const touch = e.changedTouches[0];
    let currentX = touch.pageX;
    let currentY = touch.pageY;
    let currentTime = Date.now();

    const pointer = document.getElementById(touch.identifier);
    pointer.style.top = `${touch.pageY}px`;
    pointer.style.left = `${touch.pageX}px`;

    let changeInDistance = calculateDistance(touchStartX, currentX, touchStartY, currentY);
    totalDistanceTraveled += changeInDistance;

    //! New Feature Call
    //? newFeature(currentX, currentY);

    touchStartX = currentX;
    touchStartY = currentY;
});

// Event listener for touch end
document.addEventListener("touchend", e => {
    if (modal.style.display == 'block') { return; }

    const touch = e.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;
    const pointer = document.getElementById(touch.identifier);
    pointer.remove();

    if (startTime !== 0) {
        totalTime = calculateTotalTime(startTime);
    }

    if (document.elementFromPoint(touch.clientX, touch.clientY) === targetPoint) {
        reachedTarget = true;
    }

    //! New Feature Call
    newFeature(touchEndX, touchEndY);

    let results = `Target Reached: ${reachedTarget}
    Total Drag Distance: ${totalDistanceTraveled.toFixed(2)} pixels
    Total Duration: ${totalTime} ms
    New Feature: ${newFeatureVal}
    `;

    modalContent.innerText = results;
    modal.style.display = 'block';
    isDragging = false;
    reachedTarget = false;

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
    sessionStorage.setItem('new_feature', newFeatureVal);
});

// Function to calculate distance between two points
function calculateDistance(x1, x2, y1, y2) {
    const disX = x2 - x1;
    const disY = y2 - y1;
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));
}

// Function to calculate total time from start
function calculateTotalTime(startTime) {
    const endTime = Date.now();
    return (endTime - startTime);
}

// Function for the new feature
function newFeature(x, y) {
    // This function can be customized by students to add new features
    // x and y are the coordinates where the feature will be applied
    // Add your custom code below
    console.log(`New feature: at (${x}, ${y})`);
    //TODO: write code here
    // newFeatureVal = ?
    newFeatureVal = (totalDistanceTraveled / totalTime).toFixed(2) + ' px/ms'; //drag speed (px/ms)
}

// Helper function to close modal
function closeModal() {
    modal.style.display = 'none';
}

/*
    Code not used in the current implementation:

    let finalSpeed = 0;
    let lastSpeed = 0;
    let peakSpeed = 0;
    let timeToPeakSpeed = 0;
    let previousSpeed = 0;
    let previousTime = 0;
    let lastAcceleration = 0;
    let averageAcceleration = 0;
    let initialX = 0;
    let initialY = 0;
    let previousChangeInSpeed = 0;

    // const targetInnerDot = document.getElementById('targetInnerDot');

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
*/
