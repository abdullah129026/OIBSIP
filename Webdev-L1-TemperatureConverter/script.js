document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('temp-input');
    const unitSelect = document.getElementById('unit-select');
    const convertBtn = document.getElementById('convert-btn');
    const errorMsg = document.getElementById('error-message');
    const resultsSection = document.getElementById('results-section');
    
    // Result cards
    const result1Label = document.querySelector('#result-1 .result-label');
    const result1Value = document.querySelector('#result-1 .result-value');
    const result2Label = document.querySelector('#result-2 .result-label');
    const result2Value = document.querySelector('#result-2 .result-value');

    const ABSOLUTE_ZERO = {
        celsius: -273.15,
        fahrenheit: -459.67,
        kelvin: 0
    };

    // Dynamic background based on unit
    function updateBackground() {
        document.body.className = `bg-${unitSelect.value}`;
    }
    unitSelect.addEventListener('change', updateBackground);
    updateBackground(); // Set initial background

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        resultsSection.classList.add('hidden');
    }

    function hideError() {
        errorMsg.classList.add('hidden');
    }

    function formatNumber(num) {
        // Round to 2 decimal places if needed to avoid precision issues
        return Math.round(num * 100) / 100;
    }

    function convertTemperature() {
        hideError();

        const inputValue = tempInput.value.trim();
        const inputUnit = unitSelect.value;

        // Validation: Empty or non-numeric
        if (inputValue === '' || isNaN(inputValue)) {
            showError('Please enter a valid numeric temperature value.');
            return;
        }

        const temp = parseFloat(inputValue);

        // Validation: Absolute Zero
        if (temp < ABSOLUTE_ZERO[inputUnit]) {
            showError(`Value is below absolute zero (${ABSOLUTE_ZERO[inputUnit]} for ${inputUnit.charAt(0).toUpperCase() + inputUnit.slice(1)}).`);
            return;
        }

        let tempC, tempF, tempK;

        // Conversion logic
        if (inputUnit === 'celsius') {
            tempC = temp;
            tempF = (temp * 9/5) + 32;
            tempK = temp + 273.15;
            
            updateResults('Fahrenheit', `${formatNumber(tempF)} °F`, 'Kelvin', `${formatNumber(tempK)} K`);
        } else if (inputUnit === 'fahrenheit') {
            tempF = temp;
            tempC = (temp - 32) * 5/9;
            tempK = (temp - 32) * 5/9 + 273.15;

            updateResults('Celsius', `${formatNumber(tempC)} °C`, 'Kelvin', `${formatNumber(tempK)} K`);
        } else if (inputUnit === 'kelvin') {
            tempK = temp;
            tempC = temp - 273.15;
            tempF = (temp - 273.15) * 9/5 + 32;

            updateResults('Celsius', `${formatNumber(tempC)} °C`, 'Fahrenheit', `${formatNumber(tempF)} °F`);
        }
    }

    function updateResults(label1, val1, label2, val2) {
        result1Label.textContent = label1;
        result1Value.textContent = val1;
        
        result2Label.textContent = label2;
        result2Value.textContent = val2;

        resultsSection.classList.remove('hidden');
    }

    // Event listeners
    convertBtn.addEventListener('click', convertTemperature);

    // Allow Enter key to trigger conversion
    tempInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertTemperature();
        }
    });
});
