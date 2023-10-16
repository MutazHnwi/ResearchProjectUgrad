let startTime = 0;
let totalTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
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
let previousSpeed2 = 0;
let modal = document.getElementById('resultsModal');
let modalContent = document.getElementById('modalBodyContent');
let results = null;
let reachedTarget = false;

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetPoint');
const targetInnerDot = document.getElementById('targetInnerDot');

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
    previousTime = startTime;
    initialX = touchStartX;
    initialY = touchStartY;
    //}
});

//Finger is moving on the screen
document.addEventListener("touchmove", e => {
    e.preventDefault();

    isDragging = true;

    const touch = e.changedTouches[0];
    let currentX = touch.pageX;
    let currentY = touch.pageY;
    let currentTime = Date.now();

    // Visual representation of where the finger is at any point
    const pointer = document.getElementById(touch.identifier)
    pointer.style.top = `${touch.pageY}px`
    pointer.style.left = `${touch.pageX}px`

    // Get the distance as finger moves on the screen
    let distance = calculateDistance(touchStartX, currentX, touchStartY, currentY);
    let time = currentTime - startTime;

    let speed = distance / time;
    lastSpeed = speed;

    // Getting the peak speed here
    if (speed > peakSpeed) {
        peakSpeed = speed;
        timeToPeakSpeed = currentTime - startTime;
    }

    //Something else to explore for acceleration
    // let currentSpeed = distance / deltaTime;
    //let acceleration = (currentSpeed - previousSpeed) / deltaTime;

    //Another  type of acceleration to be calculated here (Last Acceleration)
    let distance2 = calculateDistance(initialX, currentX, initialY, currentY);
    let time2 = currentTime - previousTime;
    let speed2 = distance2 / time2;
    let acceleration2 = (speed2 - previousSpeed2) / time2;
    lastAcceleration = acceleration2;
    console.log(` Last acceleration: ${lastAcceleration.toFixed(8)}`);


    //Average acceleration
    let acceleration = (speed - previousSpeed) / (time);
    averageAcceleration = acceleration;
    console.log(` Average acceleration: ${averageAcceleration.toFixed(8)}`);

    previousSpeed = speed;
    previousTime = currentTime;
    initialX = currentX;
    initialY = currentY;
    previousSpeed2 = speed2;

});


//Finger leaves the screen
document.addEventListener("touchend", e => {

    const touch = e.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;
    const pointer = document.getElementById(touch.identifier);
    pointer.remove();

    //Calculating the distance covered
    const distance = calculateDistance(touchStartX, touchEndX, touchStartY, touchEndY);

    // Calculating total duration
    if (startTime !== 0) {
        totalTime = calculateTotalTime(startTime);
    }

    //Calculating the drag speed
    const dragSpeed = calculateDragSpeed(distance, totalTime);

    let tapDuration = isDragging ? null : totalTime;

    let tapAreaSize = Math.abs(touchStartX - touchEndX) * Math.abs(touchStartY - touchEndY);


    if (document.elementFromPoint(touch.clientX, touch.clientY) === targetPoint
        || document.elementFromPoint(touch.clientX, touch.clientY) === targetInnerDot) {
        reachedTarget = true;
    }
    results = `Target reached: ${reachedTarget}
    Tap duration: ${tapDuration !== null ? tapDuration : 'Not a tap'} ms
    Drag distance: ${distance.toFixed(2)} pixels
    Total duration: ${totalTime} ms
    Average drag speed: ${dragSpeed.toFixed(2)} px/ms
    Last speed: ${lastSpeed.toFixed(2)} px/ms
    Peak speed: ${peakSpeed.toFixed(2)} px/ms
    Time to peak speed: ${timeToPeakSpeed} ms
    Last acceleration: ${lastAcceleration.toFixed(8)} ms^2
    Average acceleration: ${averageAcceleration.toFixed(8)} ms^2
    Tap area: = ${tapAreaSize.toFixed(2)} px^2`;

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
function closeModal() {
    modal.style.display = 'none';
}
