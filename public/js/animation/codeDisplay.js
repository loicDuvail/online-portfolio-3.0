const codeDisplay = document.getElementById("code-display");

// colors

const BLUE = "#6195E6";
const YELLOW = "#E6EC90";
const PURPLE = "#CF8EE5";
const LIGHT_RED = "#E58F61";
const LIGHT_GREEN = "#C3F496";

// highlights settings

const wordsColors = {
    function: BLUE,
    const: BLUE,
    class: BLUE,
    let: BLUE,
    var: BLUE,
    of: BLUE,
    in: BLUE,
    this: BLUE,
    false: BLUE,
    true: BLUE,
    new: BLUE,
    for: PURPLE,
    while: PURPLE,
    do: PURPLE,
    if: PURPLE,
    return: PURPLE,
};

//will be later filled with custom functions names used displayed code
let updatedWordsColors = wordsColors;

const symbolsColors = {
    "(": "yellow",
    ")": "yellow",
    "{": "yellow",
    "}": "yellow",
    "[": "yellow",
    "]": "yellow",
    ",": "white",
    ".": "white",
    ";": "white",
    "*": "white",
    "=": "white",
    "+": "white",
    "-": "white",
    "/": "white",
    0: LIGHT_GREEN,
    1: LIGHT_GREEN,
    2: LIGHT_GREEN,
    3: LIGHT_GREEN,
    4: LIGHT_GREEN,
    5: LIGHT_GREEN,
    6: LIGHT_GREEN,
    7: LIGHT_GREEN,
    8: LIGHT_GREEN,
    9: LIGHT_GREEN,
};

const validEnds = [
    ",",
    ".",
    ";",
    " ",
    "(",
    ")",
    `
`,
];

//returns html containing highlighted text
function highlight(text) {
    text = highlightEveryFunctions(text);
    text = highlightWords(text);
    text = highlightQuotes(text);
    text = highlightSymbols(text);
    codeDisplay.innerHTML = text;
}

//returns html with highlighted words
function highlightWords(text) {
    for (const word in updatedWordsColors)
        for (const validEnd of validEnds) {
            const string2replace = word + validEnd;
            text = text.replaceAll(
                string2replace,
                `<span style="color:${updatedWordsColors[word]}">${word}</span>${validEnd}`
            );
        }
    return text;
}

let lastParenthesisIndex = -1;
//highlights first not yet highlighted function
function highlightFunction(text) {
    //finds new parenthesis index
    const parenthesisIndex = text.indexOf("(", lastParenthesisIndex + 1);
    if (parenthesisIndex == -1) return text;
    //since span part adds 36 chars to text
    lastParenthesisIndex = parenthesisIndex + 36;
    const validEndsIndexes = everyValidEndsIndexes(text);
    //finds index from which to highlight (start of function name)
    const closestSmallerValidEndIndex = findGSV(
        parenthesisIndex,
        validEndsIndexes
    );

    const functionName = text.substring(
        closestSmallerValidEndIndex,
        parenthesisIndex
    );

    const re = /[A-Za-z0-9]/g;

    if (functionName.match(re))
        updatedWordsColors[functionName.substring(1, functionName.length)] =
            YELLOW;

    //in case where function at the beggining of textarea
    //and therefore no previous valid end
    if (closestSmallerValidEndIndex == 0) {
        text =
            text.substring(0, closestSmallerValidEndIndex) +
            `<span style="color:${YELLOW}">${text.substring(
                closestSmallerValidEndIndex,
                parenthesisIndex
            )}</span>` +
            text.substring(parenthesisIndex, text.length);
        return text;
    }

    //regular case
    text =
        text.substring(0, closestSmallerValidEndIndex + 1) +
        `<span style="color:${YELLOW}">${text.substring(
            closestSmallerValidEndIndex + 1,
            parenthesisIndex
        )}</span>` +
        text.substring(parenthesisIndex, text.length);
    return text;
}

//returns HTML with every functions highlighted
function highlightEveryFunctions(text) {
    do text = highlightFunction(text);
    while (text.indexOf("(", lastParenthesisIndex + 1) != -1);
    lastParenthesisIndex = -1;
    return text;
}

//returns HTML with highlighted symbols
function highlightSymbols(text) {
    let symbols2highlight = [];
    //selects every symbols to highlight and puts them in previous array
    //as an object with an index and a value property
    for (const symbol in symbolsColors) {
        const symbolsIndexes = everyIndexOf(symbol, text);
        if (symbolsIndexes.length != 0)
            for (const symbolIndex of symbolsIndexes) {
                //don't highlight text inside spans or quotation marks
                if (
                    !isBetween(symbolIndex, text, "<", ">") &&
                    !isBetween(
                        symbolIndex,
                        text,
                        `<span style="color:#E58F61">`,
                        "</span>"
                    )
                )
                    symbols2highlight.push({
                        index: symbolIndex,
                        value: text[symbolIndex],
                    });
            }
    }

    symbols2highlight = sortArray(symbols2highlight);

    for (const symbol2highlight of symbols2highlight) {
        const { index, value } = symbol2highlight;
        const color = symbolsColors[value];
        const replaceValue = `<span style="color:${color}">${text.substring(
            index,
            index + 1
        )}</span>`;
        text =
            text.substring(0, index) +
            replaceValue +
            text.substring(index + 1, text.length);
        symbols2highlight.every(
            (symbol) => (symbol.index += replaceValue.length - 1)
        );
    }
    return text;
}

//returns HTML with highlighted quotes
function highlightQuotes(text) {
    //qm = quotation marks
    const everyQmIndexes = everyIndexOf('"', text);
    if (everyQmIndexes.length == 0) return text;
    let qm2HighlightIndexes = [];
    //gets every qm not in spans
    for (const qmIndex of everyQmIndexes) {
        if (!isBetween(qmIndex, text, "<", ">"))
            qm2HighlightIndexes.push(qmIndex);
    }

    let startQmIndexes = [];
    let endQmIndexes = [];

    for (let i = 0; i < qm2HighlightIndexes.length; i++) {
        if (i % 2 == 0) startQmIndexes.push(qm2HighlightIndexes[i]);
        else endQmIndexes.push(qm2HighlightIndexes[i]);
    }

    for (let i = 0; i < endQmIndexes.length; i++) {
        const startQmIndex = startQmIndexes[i];
        const endQmIndex = endQmIndexes[i];
        const replace = `<span style="color:${LIGHT_RED}">${text.substring(
            startQmIndex,
            endQmIndex + 1
        )}</span>`;
        text =
            text.substring(0, startQmIndex) +
            replace +
            text.substring(endQmIndex + 1, text.length);

        for (let i = 0; i < endQmIndexes.length; i++) {
            startQmIndexes[i] +=
                replace.length -
                text.substring(startQmIndex, endQmIndex + 1).length;
            endQmIndexes[i] +=
                replace.length -
                text.substring(startQmIndex, endQmIndex + 1).length;
        }
    }

    return text;
}

const code = `
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth / 2.5;
canvas.height = window.innerHeight / 1.5;

const c = canvas.getContext("2d");

const G = 0.03;
const resitutionCoef = 0.6;
const frictionCoef = 0.9;
let grav = false;

const colors = ["#EF626C", "#F6E8EA", "#22181C", "#312F2F", "#84DCCF"];

class Ball {
    constructor(x, y, dx, dy, color, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.bouncingY = false;
        this.color = color;
        this.radius = radius;
    }

    draw = () => {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        c.fill();
    };

    move = () => {
        this.x += this.dx;
        this.y += this.dy;
    };

    bounce = () => {
        if (this.x + this.radius > canvas.width) this.dx = -Math.abs(this.dx);
        if (this.x - this.radius < 0) this.dx = Math.abs(this.dx);
        if (this.y + this.radius > canvas.height)
            (this.dy = -Math.abs(this.dy)), (this.bouncingY = true);
        if (this.y - this.radius < 0) this.dy = Math.abs(this.dy);
    };

    gravity = () => {
        this.dy += G;
    };

    restitution = () => {
        if (this.bouncingY)
            (this.dy = this.dy * resitutionCoef),
                (this.dx = this.dx * frictionCoef);
    };
}

const balls = [];

for (let i = 0; i < 35; i++) {
    const radius = Math.random() * 12 + 10;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    const dx = (Math.random() - 0.5) * 0.7;
    const dy = (Math.random() - 0.5) * 0.7;
    const color = colors[parseInt(Math.random() * colors.length)];
    const ball = new Ball(x, y, dx, dy, color, radius);
    balls.push(ball);
}

function frame() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (const ball of balls) animateBall(ball);
}

function animateBall(ball) {
    if (grav) ball.gravity(), ball.restitution();
    ball.bouncingY = false;
    ball.bounce();
    ball.move();
    ball.draw();
}

let interval;

let ballAnimationRunning = false;

function startBallAnimation() {
    interval = setInterval(frame, 5);
    ballAnimationRunning = true;
}

function stopBallAnimation() {
    clearInterval(interval);
    ballAnimationRunning = false;
}

startBallAnimation();
`;

//used to fill secondaryWordsColor from the start with
//used functions names
highlightEveryFunctions(code);

let writeCodeInterval;
let i = 0;
let codeState = "not written";
let output = "";

//code writing animation with syntax highlighting
function writeCode() {
    codeState = "writing...";
    writeCodeInterval = setInterval(() => {
        for (let j = 0; j < 5; j++) {
            // ||" " to avoid having "undefined" written when i>code.length
            output += code[i] || "";
            i++;
        }
        highlight(output);
        if (i >= 1000) {
            highlight(
                code +
                    `
`
            );
            clearInterval(writeCodeInterval), (codeState = "written");
        }
    }, 10);
}

function stopWritingCode() {
    clearInterval(writeCodeInterval);
    codeState = "paused";
}

const cdp = document.getElementById("code-display-parent");
if (window.innerWidth < 1126) {
    cdp.classList.remove("desktop");
    cdp.classList.add("mobile");
}
