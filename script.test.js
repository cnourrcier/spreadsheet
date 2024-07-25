// script.test.js

const {
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
} = require('./script.js'); // Adjust the path if needed

// Mock DOM elements for evalFormula test
const createMockCell = (id, value) => ({
    id,
    value
});

beforeEach(() => {
    // Set up a basic DOM structure
    document.body.innerHTML = `
        <div id="container">
            <input id="A1" value="5" />
            <input id="B1" value="3" />
            <input id="C1" value="A1 + B1" />
        </div>
    `;
});

test('infixToFunction adds numbers correctly', () => {
    expect(infixToFunction['+'](1, 2)).toBe(3);
});

test('infixEval evaluates simple addition', () => {
    const regex = /(\d+\.?\d*)\s*([+-])\s*(\d+\.?\d*)/;
    expect(infixEval('3 + 5', regex)).toBe('8');
});

test('highPrecedence evaluates multiplication first', () => {
    expect(highPrecedence('2 + 3 * 4')).toBe('2 + 12');
});

test('isEven returns true for even numbers', () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(5)).toBe(false);
});

test('sum calculates the sum of an array of numbers', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
});

test('average calculates the average of an array of numbers', () => {
    expect(average([2, 4, 6, 8])).toBe(5);
});

test('median calculates the median of an array of numbers', () => {
    expect(median([1, 3, 3, 6, 7, 8, 9])).toBe(6);
    expect(median([1, 2, 3, 4, 5, 6, 8, 9])).toBe(4.5);
});

test('random generates a number within the specified range', () => {
    const result = random([1, 10]);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
});

test('range generates a range of numbers', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
});

test('charRange generates a range of characters', () => {
    expect(charRange('a', 'e')).toEqual(['a', 'b', 'c', 'd', 'e']);
});

test('applyFunction applies sum function correctly', () => {
    expect(applyFunction('sum(1, 2, 3)')).toBe('6');
});

test('evalFormula evaluates a formula with cell references', () => {
    const cells = [
        createMockCell('A1', '5'),
        createMockCell('B1', '3'),
        createMockCell('C1', 'A1 + B1')
    ];
    expect(evalFormula('C1', cells)).toBe('8');
});
