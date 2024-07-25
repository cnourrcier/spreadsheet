// infix functions
const infixToFunction = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
};

/**
 * Evaluates an infix expression.
 * @param {string} str - The string containing the expression.
 * @param {RegExp} regex - The regular expression to match the infix operation.
 * @returns {string} - The evaluated expression as a string.
 */
const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

/**
 * Evaluates high precedence operations (* and /) in an expression.
 * @param {string} str - The expression string.
 * @returns {string} - The expression with high precedence operations evaluated.
 */
const highPrecedence = (str) => {
    const regex = /(\d+\.?\d*)\s*([*/])\s*(\d+\.?\d*)/;
    const str2 = infixEval(str, regex);
    return str2 === str ? str : highPrecedence(str2);
};

/**
 * Checks if a number is even.
 * @param {number} num - The number to check.
 * @returns {boolean} - True if the number is even, false otherwise.
 */
const isEven = (num) => num % 2 === 0;

/**
 * Sums an array of numbers.
 * @param {number[]} nums - The array of numbers.
 * @returns {number} - The sum of the numbers.
 */
const sum = (nums) => nums.reduce((acc, el) => acc + el, 0);

/**
 * Calculates the average of an array of numbers.
 * @param {number[]} nums - The array of numbers.
 * @returns {number} - The average of the numbers.
 */
const average = (nums) => sum(nums) / nums.length;

/**
 * Calculates the median of an array of numbers.
 * @param {number[]} nums - The array of numbers.
 * @returns {number} - The median of the numbers.
 */
const median = (nums) => {
    const sorted = nums.slice().sort((a, b) => a - b);
    const length = sorted.length;
    const middle = Math.floor(length / 2);

    return isEven(length)
        ? average([sorted[middle - 1], sorted[middle]])
        : sorted[middle];
}

/**
 * Generates a random number between x and y (inclusive).
 * @param {number[]} range - The range [x, y].
 * @returns {number} - The random number.
 */
const random = ([x, y]) => {
    const min = Math.min(x, y);
    const max = Math.max(x, y);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates an array of numbers from start to end (inclusive).
 * @param {number} start - The start number.
 * @param {number} end - The end number.
 * @returns {number[]} - The array of numbers.
 */
const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);

/**
 * Generates an array of characters from start to end (inclusive).
 * @param {string} start - The start character.
 * @param {string} end - The end character.
 * @returns {string[]} - The array of characters.
 */
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

/**
 * Applies a function to the given string expression.
 * @param {string} str - The expression string.
 * @returns {string} - The expression with functions applied.
 */
const applyFunction = (str) => {
    const noHigh = highPrecedence(str);
    const infix = /([\d]+\.?\d*)\s*([+-])\s*(\d+\.?\d*)/;
    const str2 = infixEval(noHigh, infix);
    const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i; // This expression will look for function calls like sum(1, 4).
    const toNumberList = (args) => args.split(',').map(parseFloat);
    const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
};

/**
 * Evaluates a formula in a cell, expanding cell references and ranges.
 * @param {string} x - The formula string.
 * @param {Array<{id: string, value: string}>} cells - The array of cell objects.
 * @returns {string} - The evaluated formula.
 */
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

    /**
     * Creates a label and appends it to the container.
     * @param {string} name - The name for the label.
     */
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

/**
 * Updates the cell value when changed.
 * @param {Event} event - The event object.
 */
const update = (event) => {
    const element = event.target;
    const value = element.value.replace(/\s/g, '');
    if (!value.includes(element.id) && value.startsWith('=')) {
        element.value = evalFormula(value.slice(1), Array.from(document.querySelectorAll('#container input')));
    };
};

module.exports = {
    infixToFunction,
    infixEval,
    highPrecedence,
    isEven,
    sum,
    average,
    median,
    random,
    range,
    charRange,
    spreadsheetFunctions,
    applyFunction,
    evalFormula
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