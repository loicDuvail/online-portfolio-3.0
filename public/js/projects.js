const carouselTop = document.getElementById("carousel-top");
const carouselBottom = document.getElementById("carousel-bottom");
let projects;

let ctMv = true;
let cbMv = true;

carouselTop.onmouseover = () => (ctMv = false);
carouselTop.onmouseleave = () => (ctMv = true);
carouselBottom.onmouseover = () => (cbMv = false);
carouselBottom.onmouseleave = () => (cbMv = true);

function createProjectEl(project) {
    const { project_name, img, id } = project;
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "350px";
    container.style.minWidth = "350px";
    container.style.height = "220px";
    container.style.overflow = "hidden";
    container.style.borderRadius = "8px";
    container.style.margin = "10px";

    const imgContainer = createImgContainer(img, project_name);
    const nameContainer = createNameContainer(project_name, id);

    container.appendChild(imgContainer);
    container.appendChild(nameContainer);

    return container;
}

function createImgContainer(img, name) {
    const imgContainer = document.createElement("img");
    imgContainer.src = img;
    imgContainer.alt = name;
    imgContainer.style.position = "absolute";
    imgContainer.style.width = "100%";

    return imgContainer;
}

function createNameContainer(name, id) {
    const nameContainer = document.createElement("div");
    nameContainer.style.position = "absolute";
    nameContainer.style.display = "flex";
    nameContainer.style.justifyContent = "center";
    nameContainer.style.alignItems = "center";
    nameContainer.style.width = "100%";
    nameContainer.style.height = "100%";
    nameContainer.innerText = name;
    nameContainer.style.textAlign = "center";
    nameContainer.style.backgroundColor = "black";
    nameContainer.style.color = "white";
    nameContainer.style.opacity = 0;
    nameContainer.style.zIndex = 2;
    nameContainer.style.transition = "opacity 300ms ease-in-out";
    nameContainer.classList.add("project-name-container");
    nameContainer.onmouseover = () => {
        nameContainer.style.opacity = 0.8;
    };
    nameContainer.onmouseleave = () => {
        nameContainer.style.opacity = 0;
    };
    nameContainer.onclick = () => window.location.replace(`/project/${id}`);

    return nameContainer;
}

function fillCarousel(carousel, projects) {
    projects = [...projects].concat([...projects]);
    const htmlProjects = projects.map((project) => createProjectEl(project));

    htmlProjects.forEach((element) => {
        carousel.appendChild(element);
    });
}

async function fillCarousels() {
    const projects = await fetch("/getProjects")
        .then((response) => response.json())
        .then((data) => {
            if (data.error) throw data.error;
            return data;
        })
        .catch((err) => console.error(err));

    for (let i = 0; i < 4; i++) {
        fillCarousel(carouselTop, projects);
        fillCarousel(carouselBottom, projects);
    }
}
fillCarousels();

function initCarouselTop() {
    const carousel = carouselTop;
    let i = 1;
    setInterval(() => {
        if (ctMv) i += 0.003;
        let dist = Math.cos(i) * 1000 - 1000;
        carousel.style.left = dist + "px";
    }, 15);
}

function initCarouselBottom() {
    const carousel = carouselBottom;
    let i = 1;
    setInterval(() => {
        if (cbMv) i += 0.003;
        let dist = Math.cos(i) * 1000 - 1000;
        carousel.style.right = dist + "px";
    }, 15);
}

initCarouselTop();
initCarouselBottom();
