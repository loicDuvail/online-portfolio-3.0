///////////// dependencies ///////////

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const serveFnGen = require("./staticServe");
const pool = require("./DB-connection");

const app = express();
app.use(express.json(), cookieParser());

const serve = serveFnGen(app);

///////////// nodemailer transporter ////////////

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
    },
});

///////////// routing /////////////

serve("public", path.join(__dirname, "../public"));

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "../public/html/index.html"))
);

app.get("/project/:id", (req, res) => {
    res.cookie("project_id", req.params.id, { sameSite: true });
    res.sendFile(path.join(__dirname, "../public/html/project.html"));
});

//////////// methods ////////////

app.post("/sendMail", (req, res) => {
    let { from, name, subject, message } = req.body;

    if (!from || !subject || !message)
        return res
            .send({ error: "error, missing info from input field" })
            .status(400);

    message =
        `
name: ${name}

email: ${from}
______________________________________

` + message;

    const email = {
        from: "portfolio.automated.mailer@gmail.com",
        to: "duvailloic1@gmail.com",
        subject,
        text: message,
    };

    console.log(email);

    transporter.sendMail(email, (err, info) => {
        if (err) console.error(err), res.send({ error: err }).status(500);
        else console.log(info), res.send({ ok: "ok" }).status(200);
    });
});

app.get("/getProjects", (req, res) => {
    pool.query(
        `SELECT id, project_name, img FROM projects`,
        (error, response) => {
            if (error)
                return (
                    res.send({ error }).status(500),
                    console.log(
                        error +
                            `
        `
                    )
                );
            res.send(response).status(200);
        }
    );
});

app.get("/getProject", (req, res) => {
    const { project_id } = req.cookies;
    if (!project_id) return res.send({ error: "project id not specified" });

    pool.query(
        `SELECT * FROM projects WHERE id = "${project_id}"`,
        (error, response) => {
            if (error) return res.send({ error }), console.log(error);
            res.send(response[0]);
        }
    );
});

/////////// error handling //////////

process.on("uncaughtException", (error) => console.error(error));

////////// server init ////////////

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
