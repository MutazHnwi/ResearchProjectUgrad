let startTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
let firstTapTime = 0;

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetPoint');
const targetInnerDot = document.getElementById('targetInnerDot');


// At the touch start
document.addEventListener("touchstart", e => {
    if (e.target === startInnerDot) {

        //Getting the current date at the start of the touch event
        startTime = Date.now();

        //Get the first touch event
        const touch = e.changedTouches[0];
        touchStartX = touch.pageX;
        touchStartY = touch.pageY;

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
    const pointer = document.getElementById(touch.identifier)
    pointer.style.top = `${touch.pageY}px`
    pointer.style.left = `${touch.pageX}px`
});


//Finger leaves the screen
document.addEventListener("touchend", e => {
    const touch = e.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;
    const pointer = document.getElementById(touch.identifier);
    pointer.remove();

    if (document.elementFromPoint(touch.clientX, touch.clientY) === targetPoint
        || document.elementFromPoint(touch.clientX, touch.clientY) === targetInnerDot) {
        alert("Amazing! You hit the target!!!")
    }
    else {
        alert("You did not hit the target. Please try again");
    }
});

