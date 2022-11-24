const showCodeBtn = document.getElementById("show-code-button");

let skillInitiated = false;
let mapInitiated = false;
let homeInitiated = false;

function onScroll() {
    let scrollTop = document.documentElement.scrollTop;
    const vh = window.innerHeight;

    if (scrollTop <= vh * 0.2 && !homeInitiated) {
        homeInitiated = true;
        setTimeout(animateHome, 500);
    }

    if (scrollTop >= vh * 0.8 && scrollTop <= vh * 1.8 && !skillInitiated) {
        skillInitiated = true;
        setInterval(() => {
            gravity = true;
        }, 500);
        setTimeout(() => {
            stopBallAnimation();
            showCodeBtn.style.opacity = 1;
            showCodeBtn.style.cursor = "pointer";
            showCodeBtn.onclick = () => {
                codeDisplay.style.opacity = 1;
                showCodeBtn.style.display = "none";
                setTimeout(() => {
                    writeCode();
                }, 650);
            };
        }, 7000);
    }

    if (scrollTop >= vh * 2.8 && !mapInitiated) {
        mapInitiated = true;
        loadMap();
    }
}

onScroll();
document.onscroll = onScroll;
