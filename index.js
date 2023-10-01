let startTime = 0;
let touchStartX, touchStartY;
let touchEndX, touchEndY;
let firstTapTime = 0;

const startPoint = document.getElementById('startInnerDot');
const targetPoint = document.getElementById('targetPoint');


startPoint.addEventListener("touchstart", e => {
    //Getting the current date at the start of the touch event
    startTime = Date.now();
    console.log("Start triggered!!!")

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

    //Double tap speed
    // const doubleTapSpeedDisplay = document.createElement('div');
    // doubleTapSpeedDisplay.className = 'display';
    // if (startTime - firstTapTime < 300) {
    //     const doubleTapSpeed = startTime - firstTapTime;
    //     doubleTapSpeedDisplay.textContent = `Double-tap speed: ${doubleTapSpeed} ms`;
    //     console.log(`Double-tap speed: ${doubleTapSpeed} ms`);
    // } else {
    //     firstTapTime = startTime;
    // }
    document.body.append(pointer)
    // document.body.appendChild(doubleTapSpeedDisplay);
    // setTimeout(() => {
    //     doubleTapSpeedDisplay.remove();
    // }, 2000);


});


document.addEventListener("touchmove", e => {
    e.preventDefault();
    console.log("Moved!!!!");
    const touch = e.changedTouches[0];
    const pointer = document.getElementById(touch.identifier)
    pointer.style.top = `${touch.pageY}px`
    pointer.style.left = `${touch.pageX}px`
});


targetPoint.addEventListener("touchend", e => {
    console.log("End!!!")
    const touch = e.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;

    // const distance = Math.sqrt(
    //     Math.pow(touchEndX - touchStartX, 2) + Math.pow(touchEndY - touchStartY, 2)
    // );
    // console.log(distance.toFixed(2) + ' pixels')
    // const distanceDisplay = document.createElement('div')
    // distanceDisplay.className = 'display'
    // distanceDisplay.textContent = 'Drag distance: ' + distance.toFixed(2) + ' pixels';
    // document.body.appendChild(distanceDisplay);


    // if (startTime !== 0) {
    //     const endTime = Date.now();
    //     const duration = endTime - startTime;
    //     const tapDurationDisplay = document.createElement('div');
    //     tapDurationDisplay.className = 'display';
    //     tapDurationDisplay.textContent = `Tap duration: ${duration} ms`;
    //     document.body.appendChild(tapDurationDisplay);


    //     const speed = (distance / duration) * 1000;
    //     const speedDisplay = document.createElement('div')
    //     speedDisplay.className = 'display'
    //     speedDisplay.textContent = `Drag speed: ${speed.toFixed(2)} pixels/second`;
    //     document.body.appendChild(speedDisplay);

    //     setTimeout(() => {
    //         distanceDisplay.remove();
    //         tapDurationDisplay.remove();
    //         speedDisplay.remove();
    //     }, 2000);

    //     console.log(`Tap duration: ${duration} ms`);
    //     console.log(`Drag speed: ${speed.toFixed(2)} pixels/second`)
    //     startTime = 0;
    // }


    // const pointer = document.getElementById(touch.identifier)
    // pointer.remove()
});


// document.addEventListener("touchcancel", e => {
//     const touch = e.changedTouches[0];
//     const pointer = document.getElementById(touch.identifier)
//     pointer.remove()
// });