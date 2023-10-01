let startTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
let firstTapTime = 0;

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetPoint');


document.addEventListener("touchstart", e => {
    if (e.target === startInnerDot) {

        //Getting the current date at the start of the touch event
        startTime = Date.now();

        //Get the first touch event
        const touch = e.changedTouches[0];
        touchStartX = touch.pageX;
        touchStartY = touch.pageY;
        console.log(`Start triggered!!!`);
        console.log(touch);


        // Create pointer to display a visual representation of where the finger is at any point
        const pointer = document.createElement("div")
        pointer.classList.add("dot")
        pointer.style.top = `${touchStartY}px`
        pointer.style.left = `${touchStartX}px`
        pointer.id = touch.identifier

        document.body.append(pointer);
    }
});


document.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const pointer = document.getElementById(touch.identifier)
    pointer.style.top = `${touch.pageY}px`
    pointer.style.left = `${touch.pageX}px`
});


document.addEventListener("touchend", e => {
    if (e.target === targetPoint) {

        const touch = e.changedTouches[0];
        touchEndX = touch.pageX;
        touchEndY = touch.pageY;
        console.log(`End!!`);


        const pointer = document.getElementById(touch.identifier);
        pointer.remove();


        alert("You did not hit the target. Please try again");
    }
});

document.addEventListener('touchend', function (event) {
    const touch = event.changedTouches[0];
    if (isMoving && document.elementFromPoint(touch.clientX, touch.clientY) === targetPoint) {
        isMoving = false;
        pointer.style.display = 'none';
        alert('You have reached the target!');
    } else if (isMoving) {
        isMoving = false;
        pointer.style.display = 'none';
    }
});