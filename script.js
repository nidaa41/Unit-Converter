// Units and their values.

const units = {
    length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        micrometer: 1000000,
        milimeter: 1000,
        nanometer: 1000000000,
        yard: 1.09361,
        mile: 0.000621371,
        inch: 39.3701,
        foot: 3.28084
    },
    weight: {
        gram: 1,
        kilogram: 0.001,
        pound: 0.00220462,
        ounce: 0.035274,
        milligram: 1000,
        metricTon:	0.000001,
        longTon: 0.000000984207,
        shortTon: 0.00000110231,
        carat: 5,
    },
    temperature: {
        celsius: 'celsius',
        fahrenheit: 'fahrenheit',
        kelvin: 'kelvin'
    },
    volume: {
        liter: 1,
        milliliter: 1000,
        gallon: 0.264172,
        cup: 4.22675,
        cubic_meter: 1000,
        cubic_kilometer: 1e12,
        cubic_centimeter: 1000,
        cubic_millimeter: 1000000,
    },
    area: {
        square_meter: 1,
        square_kilometer: 0.000001,
        hectare: 0.0001,
        acre: 0.000247105,
        square_mile: 0.000000386102,
        square_yard: 1.19599,
        square_foot: 10.7639,
        square_inch: 1550.003,
        square_centimeter: 10000,
        square_millimeter: 1000000
    },
    time: {
        second: 1,
        millisecond: 1000,
        microsecond: 1000000,
        nanosecond: 1000000000,
        minute: 1 / 60,
        hour: 1 / 3600,
        day: 1 / 86400,
        week: 1 / 604800,
        year: 1 / 31536000
    },
};

// DOM Elements

const categorySelect = document.getElementById("unit-category");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const fromValueInput = document.getElementById("from-value");
const toValueInput = document.getElementById("to-value");
const resultText = document.getElementById("result-text");
const historyList = document.getElementById("history-list");
const convertBtn = document.getElementById("convert-btn");
const clearBtn = document.getElementById('clear-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Unit Dropdowns

function unitDropdowns(category) {
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';

  const unitsInCategory = units[category];

  for(let unitName in unitsInCategory) {
    const label = unitName.replace(/_/g, ' ');
    const option1 = new Option(label, unitName);
    const option2 = new Option(label, unitName);
    fromUnit.add(option1);
    toUnit.add(option2);
  }
  toUnit.selectedIndex = 1;
}

// Convert input values

function convertUnits() {
  const category = categorySelect.value;
  const from = fromUnit.value;
  const to = toUnit.value;
  const inputValue = parseFloat(fromValueInput.value);

  if(isNaN(inputValue)) {
    resultText.textContent = "Please enter a valid number.";
    toValueInput.value = '';
    return;
  }

  let result;

  if (category === 'temperature') {
    result = convertTemperature(inputValue, from, to);
  } else {
    const base = inputValue / units[category][from];
    result = base * units[category][to];
  }

  const rounded = Number(result.toFixed(4));
  toValueInput.value = rounded;
  resultText.textContent = `${inputValue} ${from} = ${rounded} ${to}`;
  
  saveHistory(`${inputValue} ${from.replace(/_/g, ' ')} ➡ ${rounded} ${to.replace(/_/g, ' ')}`);
}

// Convert Temperature

function convertTemperature(value, from, to) {
  if (from === to) return value;

  switch (from) {
    case 'celsius':
      if (to === 'fahrenheit') return value * 9 / 5 + 32;
      if (to === 'kelvin') return value + 273.15;
      break;
    case 'fahrenheit':
      if (to === 'celsius') return (value - 32) * 5 / 9;
      if (to === 'kelvin') return (value - 32) * 5 / 9 + 273.15;
      break;
    case 'kelvin':
      if (to === 'celsius') return value - 273.15;
      if (to === 'fahrenheit') return (value - 273.15) * 9 / 5 + 32;
      break;
  }

  return value;
}

// Save History

function saveHistory(entry) {
  let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
  history.unshift(entry);
  if (history.length > 20) history.pop();
  localStorage.setItem('conversionHistory', JSON.stringify(history));
  renderHistory();
}

// Render History

function renderHistory() {
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// Clear Fields

function clearFields() {
  fromValueInput.value = '';
  toValueInput.value = '';
  resultText.textContent = '';
}

// Clear History

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('conversionHistory');
  renderHistory();
});

// Event Listeners

categorySelect.addEventListener('change', () => {
  unitDropdowns(categorySelect.value);
});
convertBtn.addEventListener('click', convertUnits);
clearBtn.addEventListener('click', clearFields);

// Dark mode toggle

const darkModeBtn = document.getElementById('dark-mode-toggle');

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  darkModeBtn.textContent = '☀️ Light Mode';
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', 'disabled');
  darkModeBtn.textContent = '🌙 Dark Mode';
}

if (localStorage.getItem('darkMode') === 'enabled') {
  enableDarkMode();
} else {
  disableDarkMode();
}

darkModeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

// Calling Functions
unitDropdowns(categorySelect.value);
renderHistory();