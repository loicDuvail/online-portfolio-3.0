const imgContainer = document.getElementById("img-container");
const imgEl = document.getElementById("img-element");
const projectTitle = document.getElementById("project-title");
const about = document.getElementById("about");
const whatILearned = document.getElementById("what-i-learned");
const gitBtn = document.getElementById("git-btn");
const liveDemoBtn = document.getElementById("live-demo-btn");

async function loadProject() {
    fetch("/getProject")
        .then((response) => response.json())
        .then((data) => {
            if (data.error) throw data.error;
            displayProject(data);
        })
        .catch((error) => {
            console.error(error);
            alert("project inaccessible, réesayez plus tard");
            setTimeout(() => {
                window.location.replace("/#projects");
            }, 100);
        });
}

function displayProject(project) {
    const {
        project_name,
        description,
        what_i_learned,
        img,
        git_link,
        live_demo_link,
    } = project;
    imgEl.src = img;
    projectTitle.innerText = project_name;
    about.innerText = parseText(description);
    whatILearned.innerText = parseText(what_i_learned);
    gitBtn.onclick = () => window.open(git_link);
    liveDemoBtn.onclick = () => window.open(live_demo_link);
    document.title = project_name;
}

function parseText(text) {
    return text.replaceAll(
        "%n",
        `
`
    );
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") loadProject();
};
