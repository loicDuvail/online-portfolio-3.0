const home = document.getElementById("home");
const myName = home.children[1];
const subTitle = home.children[3];
const myProfile = document.getElementById("my-profile");
const hr = document.getElementsByTagName("hr")[0];
const downArrow = document.getElementById("down-arrow");

function animateHome() {
    const name = "Loïc Duvail";
    const sub = "Développeur fullstack";
    let i = 0;
    let j = 0;

    writeInParent(name, myName, 80);

    setTimeout(() => {
        hr.style.opacity = 1;
    }, 1600);

    setTimeout(() => {
        writeInParent(sub, subTitle, 70);

        setTimeout(() => {
            myProfile.style.opacity = 1;
        }, 2000);

        setTimeout(() => {
            downArrow.style.opacity = 1;
        }, 3500);
    }, 2600);
}

function writeInParent(text, parent, msInterval) {
    let i = 0;
    let interval = setInterval(() => {
        if (i >= text.length - 1) clearInterval(interval);
        i++;
        if (text[i] === " ") i++;
        parent.innerText = text.substring(0, i);
    }, msInterval);
}
