let currentMode = 'calculator';
let display = '0';
let previousValue = null;
let operation = null;
let shouldResetDisplay = false;

function switchMode(mode) {
    currentMode = mode;
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('calculator-mode').style.display = 'none';
    document.getElementById('voltage-mode').style.display = 'none';
    document.getElementById('resistance-mode').style.display = 'none';
    document.getElementById('current-mode').style.display = 'none';

    const modeNames = {
        'calculator': 'Skaičiavimas',
        'voltage': 'Įtampos skaičiavimas',
        'resistance': 'Varžos skaičiavimas',
        'current': 'Srovės skaičiavimas'
    };

    document.getElementById('modeDisplay').textContent = 'Režimas: ' + modeNames[mode];

    if (mode === 'calculator') {
        document.getElementById('calculator-mode').style.display = 'block';
        display = '0';
        updateDisplay();
    } else if (mode === 'voltage') {
        document.getElementById('voltage-mode').style.display = 'block';
        document.getElementById('display').textContent = 'U = I × R';
    } else if (mode === 'resistance') {
        document.getElementById('resistance-mode').style.display = 'block';
        document.getElementById('display').textContent = 'R = U / I';
    } else if (mode === 'current') {
        document.getElementById('current-mode').style.display = 'block';
        document.getElementById('display').textContent = 'I = U / R';
    }
}

// skaičiuotuvas
function appendNumber(num) {
    if (shouldResetDisplay) {
        display = num;
        shouldResetDisplay = false;
    } else {
        if (display === '0' && num !== '.') {
            display = num;
        } else if (num === '.' && display.includes('.')) {
            return;
        } else {
            display += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (previousValue === null) {
        previousValue = parseFloat(display);
    } else if (!shouldResetDisplay) {
        previousValue = performCalculation(previousValue, parseFloat(display), operation);
        display = previousValue.toString();
    }
    operation = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (previousValue !== null && operation !== null) {
        previousValue = performCalculation(previousValue, parseFloat(display), operation);
        display = parseFloat(previousValue.toFixed(6)).toString();
        operation = null;
        previousValue = null;
        shouldResetDisplay = true;
        updateDisplay();
    }
}

function performCalculation(prev, current, op) {
    switch (op) {
        case '+': return prev + current;
        case '-': return prev - current;
        case '*': return prev * current;
        case '/': return prev / current;
        default: return current;
    }
}

function clearDisplay() {
    display = '0';
    previousValue = null;
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function toggleSign() {
    display = (parseFloat(display) * -1).toString();
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').textContent = display;
}

// skaičiavimo funkcijos
function calculateCurrent() {
    const current = parseFloat(document.getElementById('voltageInput').value);
    const resistance = parseFloat(document.getElementById('voltageResistance').value);

    if (isNaN(current) || isNaN(resistance)) {
        alert('Prašome įvesti tinkamas reikšmes!');
        return;
    }

    const voltage = current * resistance;
    document.getElementById('voltageResult').style.display = 'block';
    document.getElementById('voltageResultValue').textContent = voltage.toFixed(4) + ' V';
    document.getElementById('display').textContent = 'Įtampa: ' + voltage.toFixed(4) + ' V';
}

function calculateVoltage() {
    const current = parseFloat(document.getElementById('voltageInput').value);
    const resistance = parseFloat(document.getElementById('voltageResistance').value);

    if (isNaN(current) || isNaN(resistance)) {
        alert('Prašome įvesti tinkamas reikšmes!');
        return;
    }

    const voltage = current * resistance;
    document.getElementById('voltageResult').style.display = 'block';
    document.getElementById('voltageResultValue').textContent = voltage.toFixed(4) + ' V';
    document.getElementById('display').textContent = 'Įtampa: ' + voltage.toFixed(4) + ' V';
}

function calculateResistance() {
    const voltage = parseFloat(document.getElementById('voltageForResistance').value);
    const current = parseFloat(document.getElementById('currentForResistance').value);

    if (isNaN(voltage) || isNaN(current) || current === 0) {
        alert('Prašome įvesti tinkamas reikšmes!');
        return;
    }

    const resistance = voltage / current;
    document.getElementById('resistanceResult').style.display = 'block';
    document.getElementById('resistanceResultValue').textContent = resistance.toFixed(4) + ' Ω';
    document.getElementById('display').textContent = 'Varža: ' + resistance.toFixed(4) + ' Ω';
}

function calculateCurrentDirect() {
    const voltage = parseFloat(document.getElementById('voltageForCurrent').value);
    const resistance = parseFloat(document.getElementById('resistanceForCurrent').value);

    if (isNaN(voltage) || isNaN(resistance) || resistance === 0) {
        alert('Prašome įvesti tinkamas reikšmes!');
        return;
    }

    const current = voltage / resistance;
    document.getElementById('currentResult').style.display = 'block';
    document.getElementById('currentResultValue').textContent = current.toFixed(4) + ' A';
    document.getElementById('display').textContent = 'Srovė: ' + current.toFixed(4) + ' A';
}

// inicializacija
switchMode('calculator');
