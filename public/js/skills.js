const skillsListContainer = document.getElementById("skills-list-container");
const skillsSelector = document.getElementById("skills-selector");
const btns = skillsSelector.children;

const nodeSkills = [
    "création de serveur",
    "routing de serveur",
    "système de création et de gestion de sessions sur mesure",
    "utilisation de cookies",
    "connection à une base de données",
    "authentification",
    "payements bancaires via Stripe",
];
const jsSkills = [
    "code propre et commenté",
    "encryption de données (SHA256, AES, RSA)",
    "utilisation de l'élément canvas (Perlin noise flow field, simulation de particules)",
    "modification dynamique de l'UI",
    "utlisiation d'API",
];
const mySkills = [
    "J'utilise HTML5, CSS, JavaScript (ES6), Node.js et MySQL pour réaliser mes projets. Je possède des compétences variées dans le développement web, et suis en capacité de créer et mettre en ligne des sites dynamiques complets et sécurisés comprenant de nombreuses fonctionnalités. Je suis capable d'autonomie mais aussi de travailler en équipe, ayant été scout pendant 5 ans.",
];

const skillsDic = {
    "my-skills": mySkills,
    "Node-js": nodeSkills,
    javascript: jsSkills,
};

for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    btn.onclick = () => {
        btns[0].style.backgroundColor = "#84dccf";
        btns[1].style.backgroundColor = "#84dccf";
        btns[2].style.backgroundColor = "#84dccf";
        btn.style.backgroundColor = "#EF626C";

        const skills = skillsDic[btn.id];
        clearParent(skillsListContainer);
        skills.forEach((skill) => {
            const skillContainer = document.createElement("div");
            skillContainer.innerText = skill;
            skillContainer.classList.add("skill");
            skillsListContainer.appendChild(skillContainer);
        });
    };
}
btns[0].click();

function clearParent(parent) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);
}
