// infix functions
const infixToFunction = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
};

const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

const highPrecedence = (str) => {
    const regex = /(\d+\.?\d*)\s*([*/])\s*(\d+\.?\d*)/;
    const str2 = infixEval(str, regex);
    return str2 === str ? str : highPrecedence(str2);
};

const isEven = (num) => num % 2 === 0;
const sum = (nums) => nums.reduce((acc, el) => acc + el, 0);
const average = (nums) => sum(nums) / nums.length;

const median = (nums) => {
    const sorted = nums.slice().sort((a, b) => a - b);
    const length = sorted.length;
    const middle = Math.floor(length / 2);

    return isEven(length)
        ? average([sorted[middle - 1], sorted[middle]])
        : sorted[middle];
}

const random = ([x, y]) => {
    const min = Math.min(x, y);
    const max = Math.max(x, y);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index); // primitive structures do not need the new keyword.
const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

const spreadsheetFunctions = {
    sum,
    average,
    median,
    even: nums => nums.filter(isEven),
    someeven: nums => nums.some(isEven),
    everyeven: nums => nums.every(num => isEven(num)),
    firsttwo: nums => nums.slice(0, 2),
    lasttwo: nums => nums.slice(-2),
    has2: nums => nums.includes(2),
    increment: nums => nums.map(num => num + 1),
    random,
    range: nums => range(...nums),
    nodupes: nums => [...new Set(nums)],
    '': arg => arg
};

const applyFunction = (str) => {
    const noHigh = highPrecedence(str);
    const infix = /([\d]+\.?\d*)\s*([+-])\s*(\d+\.?\d*)/;
    const str2 = infixEval(noHigh, infix);
    const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i; // This expression will look for function calls like sum(1, 4).
    const toNumberList = (args) => args.split(',').map(parseFloat);
    const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
};

const evalFormula = (x, cells) => {
    const idToText = (id) => cells.find(cell => cell.id === id)?.value || '';
    const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
    const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
    const elemValue = num => character => idToText(character + num);
    const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num));
    const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2)).join(','));
    const cellRegex = /[A-J][1-9][0-9]?/gi;
    const cellExpanded = rangeExpanded.replace(cellRegex, (match) => idToText(match.toUpperCase()));
    const functionExpanded = applyFunction(cellExpanded);
    return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
};

window.onload = () => {
    const container = document.getElementById('container');

    const createLabel = (name) => {
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = name;
        container.appendChild(label);
    };

    const letters = charRange('A', 'J');
    letters.forEach(createLabel);
    range(1, 99).forEach((number) => {
        createLabel(number);
        letters.forEach((letter) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = letter + number;
            input.setAttribute('aria-label', letter + number);
            input.onchange = update;
            container.appendChild(input);
        });
    });
};

const update = (event) => {
    const element = event.target;
    const value = element.value.replace(/\s/g, '');
    if (!value.includes(element.id) && value.startsWith('=')) {
        element.value = evalFormula(value.slice(1), Array.from(document.querySelectorAll('#container input')));
    };
};












// Notes:

// The global window object represents the browser window (or tab). 
// It has an onload property which allows you to define behavior 
// when the window has loaded the entire page, 
// including stylesheets and scripts.

// the document object has a .createElement() method 
// which allows you to dynamically create new HTML elements.

// I need to be able to match cell ranges in a formula. 
// Cell ranges examples: A1:B12 or A3:A25. 
// I can use a regular expression to match these patterns.

// In JavaScript, it is common convention to prefix an unused parameter with an underscore _. 
// You could also leave the parameter empty like so: (, char1) 
// but it is often clearer to name the parameter for future readability.

// Object values do not have to be primitive types, like a string or a number. 
// They can also be functions.