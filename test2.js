const startPoint = document.getElementById('startPoint');
const targetPoint = document.getElementById('targetPoint');
const pointer = document.getElementById('pointer');

let isMoving = false;

document.addEventListener('touchstart', function (event) {
    if (event.target === startPoint) {
        isMoving = true;
        pointer.style.display = 'block';
        console.log('Action started');
    }
});

document.addEventListener('touchmove', function (event) {
    console.log("Move!");
    if (isMoving) {
        const touch = event.touches[0];
        pointer.style.left = touch.clientX - 10 + 'px';
        pointer.style.top = touch.clientY - 10 + 'px';
        event.preventDefault();
    }
});

document.addEventListener('touchend', function (event) {
    console.log("End!");
    const touch = event.changedTouches[0];
    console.log(touch.clientX);
    console.log(touch.clientY);
    console.log(targetPoint);
    console.log(targetPoint.clientX);
    console.log(targetPoint.clientY);
    if (isMoving && document.elementFromPoint(touch.clientX, touch.clientY) === targetPoint) {
        isMoving = false;
        pointer.style.display = 'none';
        alert('You have reached the target!');
        console.log("You have reached the target");
    } else if (isMoving) {
        isMoving = false;
        pointer.style.display = 'none';
        console.log("You nor reach!");
    }
});
