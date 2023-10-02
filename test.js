let startTime = 0;
let totalTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
let lastSpeed = 0;
let peakSpeed = 0
let timeToPeakSpeed = 0;

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetPoint');
const targetInnerDot = document.getElementById('targetInnerDot');

// At the touch start
document.addEventListener("touchstart", e => {
    //Getting the current date at the start of the touch event
    if (e.target === startPoint) {

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
    }
});

//Finger is moving on the screen
document.addEventListener("touchmove", e => {
    e.preventDefault();

    const touch = e.changedTouches[0];
    let currentX = touch.pageX;
    let currentY = touch.pageY;
    let currentTime = Date.now();

    // Visual representation of where the finger is at any point
    const pointer = document.getElementById(touch.identifier)
    pointer.style.top = `${touch.pageY}px`
    pointer.style.left = `${touch.pageX}px`

    let distance = calculateDistance(touchStartX, currentX, touchStartY, currentY);
    let time = currentTime - startTime;

    let speed = distance / time;
    lastSpeed = speed;

    // Getting the peak speed here
    if (speed > peakSpeed) {
        peakSpeed = speed;
        timeToPeakSpeed = currentTime - startTime;
    }
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

    // Calculating tap duration
    if (startTime !== 0) {
        totalTime = calculateTotalTime(startTime);
    }

    //Calculating the drag speed
    const dragSpeed = calculateDragSpeed(distance, totalTime);

    if (document.elementFromPoint(touch.clientX, touch.clientY) === targetPoint
        || document.elementFromPoint(touch.clientX, touch.clientY) === targetInnerDot) {
        alert(
            `Amazing! You hit the target!!!
            Drag distance: ${distance.toFixed(2)} pixels
            Total duration: ${totalTime} ms
            Average drag speed: ${dragSpeed.toFixed(2)} px/ms
            Last speed: ${lastSpeed.toFixed(2)} px/ms
            Peak speed: ${peakSpeed.toFixed(2)} px/ms
            Time to peak speed: ${timeToPeakSpeed} ms`
        );
    }
    else {
        alert(
            `You did not hit the target. Please try again
            Drag distance: ${distance.toFixed(2)} pixels
            Total duration: ${totalTime} ms
            Average drag speed: ${dragSpeed.toFixed(2)} px/ms
            Last speed: ${lastSpeed.toFixed(2)} px/ms
            Peak speed: ${peakSpeed.toFixed(2)} px/ms
            Time to peak speed: ${timeToPeakSpeed} ms`
        );
    }
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