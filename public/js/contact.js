const emailInput = document.getElementById("email-input");
const nameInput = document.getElementById("name-input");
const subjectInput = document.getElementById("subject-input");
const messageInput = document.getElementById("message-input");
const sendMailBtn = document.getElementById("send-mail-button");

const loadingAnimation = document.getElementById("loading-animation");

const copyEmailBtn = document.getElementById("copy-email-button");
const copyAlert = document.getElementById("copy-alert");

const inputs = [emailInput, nameInput, subjectInput, messageInput];

function sendMail() {
    const [email, name, subject, message] = inputs.map((input) => input.value);

    if (!email || !name || !subject || !message)
        return alert(
            "remplissez tous les champs avant d'envoyer votre message"
        );

    inputs.forEach((input) => (input.value = ""));

    reveal(loadingAnimation);

    fetch("/sendMail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            from: email,
            subject,
            message,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.error) throw response.error;
            hide(loadingAnimation);
            setTimeout(() => {
                alert("message envoyé!");
            }, 100);
        })
        .catch((error) => {
            return (
                alert(
                    "échec de l'envoi du message, vérifiez votre connection internet ou réessayez plus tard"
                ),
                console.error(error)
            );
        });
}

sendMailBtn.onclick = sendMail;

///////// interactive elements /////////

function reveal(el) {
    el.style.display = "flex";
    setTimeout(() => {
        el.style.opacity = 1;
    }, 10);
}

function hide(el) {
    el.style.opacity = 0;
    setTimeout(() => {
        el.style.display = "none";
    }, 400);
}

copyEmailBtn.onclick = () => {
    navigator.clipboard.writeText("duvailloic1@gmail.com");
    reveal(copyAlert);
    setTimeout(() => {
        hide(copyAlert);
    }, 2500);
};
