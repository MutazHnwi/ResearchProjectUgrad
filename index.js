let startTime = 0;

document.addEventListener("touchstart", e => {
    [...e.changedTouches].forEach(touch => {
        startTime = Date.now();
        const pointer = document.createElement("div")
        pointer.classList.add("dot")
        pointer.style.top = `${touch.pageY}px`
        pointer.style.left = `${touch.pageX}px`
        pointer.id = touch.identifier
        document.body.append(pointer)
    })
})

document.addEventListener("touchmove", e => {
    [...e.changedTouches].forEach(touch => {
        const pointer = document.getElementById(touch.identifier)
        pointer.style.top = `${touch.pageY}px`
        pointer.style.left = `${touch.pageX}px`
    })
})

document.addEventListener("touchend", e => {
    [...e.changedTouches].forEach(touch => {
        if (startTime !== 0) {
            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log(`Tap duration: ${duration} ms`);
            startTime = 0;
        }
        const pointer = document.getElementById(touch.identifier)
        pointer.remove()
    })
})

document.addEventListener("touchcancel", e => {
    [...e.changedTouches].forEach(touch => {
        const pointer = document.getElementById(touch.identifier)
        pointer.remove()
    })
})