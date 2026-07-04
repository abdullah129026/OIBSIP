// Modern Calculator JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const keysGrid = document.getElementById('keys-grid');

    // Calculator State
    let displayValue = '0';
    let expression = '';
    let shouldResetDisplay = false;
    let isEvaluated = false;
    let activeOperatorBtn = null;

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateFunctionKeys(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateFunctionKeys(newTheme);
    });

    // Update function keys based on theme (Scientific in Dark Mode, Standard in Light Mode)
    function updateFunctionKeys(theme) {
        const fn1 = document.getElementById('key-fn1');
        const fn2 = document.getElementById('key-fn2');
        const fn3 = document.getElementById('key-fn3');
        const fn4 = document.getElementById('key-fn4');

        if (theme === 'dark') {
            fn1.textContent = 'sc';
            fn1.setAttribute('data-val', 'sc');
            fn2.textContent = 'sin';
            fn2.setAttribute('data-val', 'sin');
            fn3.textContent = 'deg';
            fn3.setAttribute('data-val', 'deg');
            fn4.textContent = '%';
            fn4.setAttribute('data-val', 'percent');
        } else {
            fn1.textContent = displayValue === '0' && expression === '' ? 'AC' : 'C';
            fn1.setAttribute('data-val', 'clear');
            fn2.textContent = '±';
            fn2.setAttribute('data-val', 'pm');
            fn3.textContent = '%';
            fn3.setAttribute('data-val', 'percent');
            fn4.textContent = '⌫';
            fn4.setAttribute('data-val', 'backspace');
        }
    }

    // Grid Event Listener (using delegation)
    keysGrid.addEventListener('click', (e) => {
        const target = e.target.closest('.key');
        if (!target) return;

        const val = target.getAttribute('data-val');
        handleInput(val, target);
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        let key = e.key;
        if (key === 'Enter') key = '=';
        if (key === 'Escape') key = 'clear';
        if (key === 'Backspace') key = 'backspace';
        
        const targetButton = [...document.querySelectorAll('.key')].find(btn => {
            const btnVal = btn.getAttribute('data-val');
            return btnVal === key;
        });

        if (targetButton) {
            targetButton.classList.add('active-pressed');
            setTimeout(() => targetButton.classList.remove('active-pressed'), 100);
            handleInput(key, targetButton);
        }
    });

    function handleInput(val, element = null) {
        switch (val) {
            case 'clear':
                resetCalculator();
                break;
            case 'backspace':
                handleBackspace();
                break;
            case 'pm':
                handlePlusMinus();
                break;
            case 'percent':
                handlePercent();
                break;
            case 'sc':
            case 'sin':
            case 'deg':
                handleScientific(val);
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                handleOperator(val, element);
                break;
            case '.':
                handleDecimal();
                break;
            case '=':
                evaluateExpression();
                break;
            default:
                if (!isNaN(val)) {
                    handleNumber(val);
                }
                break;
        }
        updateDisplay();
    }

    function resetCalculator() {
        displayValue = '0';
        expression = '';
        shouldResetDisplay = false;
        isEvaluated = false;
        clearActiveOperator();
    }

    function handleBackspace() {
        if (isEvaluated) {
            expression = '';
            isEvaluated = false;
            return;
        }
        if (shouldResetDisplay) return;

        if (displayValue.length > 1) {
            displayValue = displayValue.slice(0, -1);
            if (displayValue === '-' || displayValue === '-0') {
                displayValue = '0';
            }
        } else {
            displayValue = '0';
        }
    }

    function handlePlusMinus() {
        if (displayValue !== '0' && displayValue !== 'Error') {
            if (displayValue.startsWith('-')) {
                displayValue = displayValue.slice(1);
            } else {
                displayValue = '-' + displayValue;
            }
        }
    }

    function handlePercent() {
        const val = parseFloat(displayValue);
        if (!isNaN(val) && displayValue !== 'Error') {
            displayValue = (val / 100).toString();
        }
    }

    function handleScientific(type) {
        const val = parseFloat(displayValue);
        if (isNaN(val) || displayValue === 'Error') return;

        if (type === 'sin') {
            displayValue = Math.sin(val).toFixed(6).replace(/\.?0+$/, '');
        } else if (type === 'deg') {
            displayValue = (val * (180 / Math.PI)).toFixed(4).replace(/\.?0+$/, '');
        } else if (type === 'sc') {
            if (val < 0) {
                displayValue = 'Error';
            } else {
                displayValue = Math.sqrt(val).toFixed(6).replace(/\.?0+$/, '');
            }
        }
    }

    function handleOperator(op, element) {
        if (displayValue === 'Error') return;

        if (isEvaluated) {
            expression = '';
            isEvaluated = false;
        }

        clearActiveOperator();

        const tokens = expression.trim().split(/\s+/);
        const lastToken = tokens[tokens.length - 1];
        const isLastTokenOperator = ['+', '-', '*', '/'].includes(lastToken);

        if (shouldResetDisplay && isLastTokenOperator) {
            // Replace the last operator
            tokens[tokens.length - 1] = op;
            expression = tokens.join(' ') + ' ';
        } else {
            // Append current display value and operator
            expression += (expression === '' ? '' : ' ') + displayValue + ' ' + op;
            shouldResetDisplay = true;
        }

        if (element && element.classList.contains('key-op')) {
            activeOperatorBtn = element;
            activeOperatorBtn.classList.add('active');
        }
    }

    function handleDecimal() {
        if (isEvaluated || displayValue === 'Error') {
            displayValue = '0';
            expression = '';
            isEvaluated = false;
        }
        if (shouldResetDisplay) {
            displayValue = '0.';
            shouldResetDisplay = false;
            clearActiveOperator();
            return;
        }
        if (!displayValue.includes('.')) {
            displayValue += '.';
        }
    }

    function clearActiveOperator() {
        if (activeOperatorBtn) {
            activeOperatorBtn.classList.remove('active');
            activeOperatorBtn = null;
        }
    }

    function evaluateExpression() {
        if (expression === '' || displayValue === 'Error') return;

        let finalExpression = expression + ' ' + displayValue;
        
        try {
            const result = parseAndCalculate(finalExpression);
            expressionDisplay.textContent = formatExpressionDisplay(finalExpression);
            
            if (result === 'Error' || isNaN(result) || !isFinite(result)) {
                displayValue = 'Error';
            } else {
                displayValue = result.toString();
            }
            
            expression = '';
            isEvaluated = true;
            shouldResetDisplay = true;
            clearActiveOperator();
        } catch (e) {
            displayValue = 'Error';
        }
    }

    function handleNumber(num) {
        if (isEvaluated || displayValue === 'Error') {
            displayValue = num;
            expression = '';
            isEvaluated = false;
            shouldResetDisplay = false;
            clearActiveOperator();
            return;
        }

        if (shouldResetDisplay) {
            displayValue = num;
            shouldResetDisplay = false;
            clearActiveOperator();
        } else {
            if (displayValue === '0') {
                displayValue = num;
            } else {
                displayValue += num;
            }
        }
    }

    function updateDisplay() {
        // Update expression display
        expressionDisplay.textContent = formatExpressionDisplay(expression);
        
        // Update result display
        if (displayValue === 'Error') {
            resultDisplay.textContent = 'Error';
        } else {
            resultDisplay.textContent = formatNumber(displayValue);
        }

        // Dynamic update of AC / C label in light mode
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            const fn1 = document.getElementById('key-fn1');
            if (fn1) {
                fn1.textContent = displayValue === '0' && expression === '' ? 'AC' : 'C';
            }
        }
    }

    function formatExpressionDisplay(expr) {
        return expr
            .replace(/\*/g, ' × ')
            .replace(/\//g, ' ÷ ')
            .replace(/\+/g, ' + ')
            .replace(/\-/g, ' − ');
    }

    function formatNumber(numStr) {
        if (numStr === 'Error') return 'Error';
        const num = parseFloat(numStr);
        if (isNaN(num)) return numStr;
        
        const parts = numStr.split('.');
        parts[0] = parseFloat(parts[0]).toLocaleString('en-US');
        return parts.join('.');
    }

    // Custom expression parser (Avoiding eval() for security)
    function parseAndCalculate(expr) {
        const tokens = expr.split(/\s+/).filter(t => t.length > 0);
        if (tokens.length === 0) return 0;

        let values = [];
        let ops = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (['+', '-', '*', '/'].includes(token)) {
                ops.push(token);
            } else {
                let val = parseFloat(token);
                if (isNaN(val)) return 'Error';
                values.push(val);
            }
        }

        // Apply multiplications and divisions first
        let i = 0;
        while (i < ops.length) {
            if (ops[i] === '*' || ops[i] === '/') {
                const op = ops[i];
                const val1 = values[i];
                const val2 = values[i + 1];
                let res = 0;

                if (op === '*') {
                    res = val1 * val2;
                } else {
                    if (val2 === 0) return 'Error'; // Division by zero protection
                    res = val1 / val2;
                }

                values.splice(i, 2, res);
                ops.splice(i, 1);
            } else {
                i++;
            }
        }

        // Apply additions and subtractions
        let result = values[0];
        for (let j = 0; j < ops.length; j++) {
            const op = ops[j];
            const nextVal = values[j + 1];
            if (op === '+') {
                result += nextVal;
            } else if (op === '-') {
                result -= nextVal;
            }
        }

        return result;
    }
});
