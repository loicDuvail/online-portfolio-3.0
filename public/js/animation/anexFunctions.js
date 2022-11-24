function everyValidEndsIndexes(text) {
    const validEndsIndexes = [];
    for (const validEnd of validEnds) {
        const indexes = everyIndexOf(validEnd, text);
        for (const index of indexes) validEndsIndexes.push(index);
    }
    return validEndsIndexes;
}

function everyIndexOf(string, text) {
    let indexes = [];
    let lastIndex = -1;
    do {
        const index = text.indexOf(string, lastIndex + 1);
        lastIndex = index;
        if (index != -1) indexes.push(index);
    } while (lastIndex != -1);
    return indexes;
}

//finds greatest value smaller than "refVal" from "values" (GSV for greatest smaller value)
function findGSV(refVal, values) {
    let gsv = 0;
    for (const value of values) if (value < refVal && value > gsv) gsv = value;
    return gsv;
}
// smallest value greater than refVal
function findSGV(refVal, values, textLen) {
    let sgv = textLen;
    for (const value of values) if (value > refVal && value < sgv) sgv = value;
    return sgv;
}

//used to ignore text inside spans since we must not highlight it
//to avoid bugs
function isBetween(index, text, str1, str2) {
    const spanStarts = everyIndexOf(str1, text);

    if (arrayGreaterThanValue(spanStarts, index)) return false;

    //selects last str1 before index
    const closestSpanStart = findGSV(index, spanStarts);

    const spanEnds = everyIndexOf(str2, text);

    if (arraySmallerThanValue(spanEnds, index)) return false;

    //selects first str2 after str1
    const closestSpanEnd = findSGV(closestSpanStart, spanEnds, text.length);
    // index > closestSpanStart by def, so isInSpan defined as so
    return index < closestSpanEnd;
}

//check if every element of array is greater than refVal
function arrayGreaterThanValue(values, refVal) {
    for (const value of values) {
        if (value < refVal) return false;
    }
    return true;
}

function arraySmallerThanValue(values, refVal) {
    for (const value of values) {
        if (value > refVal) return false;
    }
    return true;
}

//sorts array of object with index property
function sortArray(array) {
    let indexesArray = [];
    for (const object of array) {
        indexesArray.push(object.index);
    }
    indexesArray.sort((a, b) => a - b);
    let sortedArray = [];
    for (const index of indexesArray) {
        sortedArray.push(array.find((object) => object.index == index));
    }
    return sortedArray;
}
