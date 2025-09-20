// Scientific Calculator Logic
class ScientificCalculator {
  constructor() {
    this.display = document.getElementById('display');
    this.currentInput = '';
    this.previousInput = '';
    this.operation = null;
    this.waitingForOperand = false;
    this.isShiftMode = false;
    this.isAlphaMode = false;
    this.memory = 0;
    this.angleMode = 'DEG'; // DEG, RAD, GRA
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      // Use pointer events for universal compatibility and fast response
      button.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handleButtonClick(e);
      });
    });

    // Add event listeners for arrow images
    const arrowElements = document.querySelectorAll('.arrow-img');
    arrowElements.forEach(element => {
      element.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handleButtonClick(e);
      });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleButtonClick(e) {
    const button = e.target;
    const action = button.dataset.function || button.dataset.number;
    
    // Immediate processing without delays
    if (button.dataset.number !== undefined) {
      this.inputNumber(button.dataset.number);
    } else if (button.dataset.function) {
      this.handleFunction(button.dataset.function);
    }
    
    // Visual feedback after processing
    button.classList.add('pressed');
    requestAnimationFrame(() => {
      setTimeout(() => button.classList.remove('pressed'), 30);
    });
  }

  handleKeyboard(e) {
    e.preventDefault();
    const key = e.key;
    
    if (/^[0-9]$/.test(key)) {
      this.inputNumber(key);
    } else {
      const functionMap = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide',
        'x': 'multiply',
        '=': 'equals',
        'Enter': 'equals',
        '.': 'decimal',
        'Escape': 'ac',
        'Delete': 'del',
        'Backspace': 'del'
      };
      
      if (functionMap[key]) {
        this.handleFunction(functionMap[key]);
      }
    }
  }

  inputNumber(number) {
    if (this.waitingForOperand) {
      this.currentInput = number;
      this.waitingForOperand = false;
    } else {
      this.currentInput = (this.currentInput === '0' || this.currentInput === '') ? number : this.currentInput + number;
    }
    this.updateDisplay();
  }

  handleFunction(func) {
    switch (func) {
      // Basic operations
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        this.handleBasicOperation(func);
        break;
        
      case 'equals':
        this.calculate();
        break;
        
      case 'ac':
        this.allClear();
        break;
        
      case 'del':
        this.delete();
        break;
        
      case 'decimal':
        this.inputDecimal();
        break;
        
      // Scientific functions
      case 'sin':
        this.handleTrigFunction('sin');
        break;
      case 'cos':
        this.handleTrigFunction('cos');
        break;
      case 'tan':
        this.handleTrigFunction('tan');
        break;
        
      case 'ln':
        this.currentInput = Math.log(parseFloat(this.currentInput)).toString();
        this.updateDisplay();
        break;
        
      case 'power':
        this.handleBasicOperation('power');
        break;
        
      case 'sqrt':
        this.currentInput = Math.sqrt(parseFloat(this.currentInput)).toString();
        this.updateDisplay();
        break;
        
      case 'x-power-y':
        this.currentInput = Math.pow(parseFloat(this.currentInput), 2).toString();
        this.updateDisplay();
        break;
        
      // Mode functions
      case 'shift':
        this.toggleShiftMode();
        break;
      case 'alpha':
        this.toggleAlphaMode();
        break;
        
      // Memory functions
      case 's-sum':
        this.memory += parseFloat(this.currentInput);
        break;
        
      // Other functions
      case 'ans':
        this.currentInput = this.previousInput || '';
        this.updateDisplay();
        break;
        
      case 'neg':
        this.currentInput = (parseFloat(this.currentInput) * -1).toString();
        this.updateDisplay();
        break;
        
      case 'exp':
        this.currentInput = parseFloat(this.currentInput).toExponential();
        this.updateDisplay();
        break;
        
      case 'parenthesis-open':
        this.currentInput += '(';
        this.updateDisplay();
        break;
        
      case 'parenthesis-close':
        this.currentInput += ')';
        this.updateDisplay();
        break;
        
      // Navigation functions
      case 'nav-up':
        console.log('Navigation Up');
        break;
      case 'nav-down':
        console.log('Navigation Down');
        break;
      case 'nav-left':
        console.log('Navigation Left');
        break;
      case 'nav-right':
        console.log('Navigation Right');
        break;
        
      default:
        console.log(`Function ${func} not implemented yet`);
    }
  }

  handleBasicOperation(nextOperation) {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput === '') {
      this.previousInput = this.currentInput;
    } else if (this.operation) {
      const currentValue = parseFloat(this.previousInput);
      const newValue = this.performCalculation(this.operation, currentValue, inputValue);

      this.currentInput = String(newValue);
      this.previousInput = this.currentInput;
      this.updateDisplay();
    }

    this.waitingForOperand = true;
    this.operation = nextOperation;
  }

  performCalculation(operation, firstValue, secondValue) {
    switch (operation) {
      case 'add':
        return firstValue + secondValue;
      case 'subtract':
        return firstValue - secondValue;
      case 'multiply':
        return firstValue * secondValue;
      case 'divide':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case 'power':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  }

  calculate() {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput !== '' && this.operation) {
      const currentValue = parseFloat(this.previousInput);
      const newValue = this.performCalculation(this.operation, currentValue, inputValue);

      this.currentInput = String(newValue);
      this.previousInput = this.currentInput;
    }

    this.waitingForOperand = true;
    this.operation = null;
    this.updateDisplay();
  }

  handleTrigFunction(func) {
    const value = parseFloat(this.currentInput);
    let radianValue = value;
    
    // Convert to radians if in degree mode
    if (this.angleMode === 'DEG') {
      radianValue = (value * Math.PI) / 180;
    }
    
    let result;
    if (this.isShiftMode) {
      // Inverse trig functions
      switch (func) {
        case 'sin':
          result = Math.asin(value);
          break;
        case 'cos':
          result = Math.acos(value);
          break;
        case 'tan':
          result = Math.atan(value);
          break;
      }
      
      // Convert back to degrees if needed
      if (this.angleMode === 'DEG') {
        result = (result * 180) / Math.PI;
      }
    } else {
      // Normal trig functions
      switch (func) {
        case 'sin':
          result = Math.sin(radianValue);
          break;
        case 'cos':
          result = Math.cos(radianValue);
          break;
        case 'tan':
          result = Math.tan(radianValue);
          break;
      }
    }
    
    this.currentInput = result.toString();
    this.updateDisplay();
  }

  allClear() {
    this.currentInput = '';
    this.previousInput = '';
    this.operation = null;
    this.waitingForOperand = false;
    this.updateDisplay();
  }

  delete() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '';
    }
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.currentInput.indexOf('.') === -1) {
      this.currentInput += '.';
      this.updateDisplay();
    }
  }

  toggleShiftMode() {
    this.isShiftMode = !this.isShiftMode;
    // Update UI to show shift mode
    const shiftIndicator = document.querySelector('.shift-indicator');
    shiftIndicator.style.visibility = this.isShiftMode ? 'visible' : 'hidden';
  }

  toggleAlphaMode() {
    this.isAlphaMode = !this.isAlphaMode;
    // Update UI to show alpha mode
    const alphaIndicator = document.querySelector('.alpha-indicator');
    alphaIndicator.style.visibility = this.isAlphaMode ? 'visible' : 'hidden';
  }

  updateDisplay() {
    // Handle empty input - show only cursor
    if (this.currentInput === '') {
      this.display.innerHTML = '<span class="cursor"></span>';
      return;
    }
    
    // Handle very long numbers
    const value = parseFloat(this.currentInput);
    let displayText = this.currentInput;
    
    // Only use exponential notation for extremely large numbers, allow up to 99 digits
    if (Math.abs(value) >= 1e99 || (Math.abs(value) < 1e-99 && value !== 0 && this.currentInput.length > 99)) {
      displayText = value.toExponential(6);
    } else {
      // Display the full number up to 99 digits
      displayText = this.currentInput;
    }
    
    // Add cursor to display text
    this.display.innerHTML = displayText + '<span class="cursor"></span>';
    
    // Minimal visual feedback
    this.display.classList.add('calculating');
    requestAnimationFrame(() => {
      this.display.classList.remove('calculating');
    });
  }

  // Advanced mathematical functions
  factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  combination(n, r) {
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  permutation(n, r) {
    return this.factorial(n) / this.factorial(n - r);
  }
}

// Mobile viewport height fix
function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize viewport height and calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set initial viewport height
  setViewportHeight();
  
  // Update viewport height on resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100); // Small delay for orientation change
  });
  
  // Initialize calculator
  new ScientificCalculator();
  
  // Prevent zoom on double tap for mobile - only on non-interactive elements
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    // Only prevent double-tap zoom on non-button elements
    if (now - lastTouchEnd <= 300 && !event.target.closest('.btn')) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
});

// Additional mathematical constants and functions
const MathConstants = {
  PI: Math.PI,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
  EULER_GAMMA: 0.5772156649015329
};

// Helper functions for advanced operations
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Error handling
function handleCalculatorError(error) {
  console.error('Calculator Error:', error);
  const display = document.getElementById('display');
  display.textContent = 'Error';
  display.classList.add('error');
  setTimeout(() => {
    display.classList.remove('error');
  }, 2000);
}