import { useState, useRef } from 'react';
import { Button } from './ui/button';

interface CalculatorProps {
  onUnlock: () => void;
}

export function Calculator({ onUnlock }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousOperand, setPreviousOperand] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  const inputBuffer = useRef<string[]>([]);
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const SECRET_CODE = ['0', '7', '0', '9', '=', '5', '1', '7'];

  const handleInput = (value: string) => {
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
    }

    inputBuffer.current = [...inputBuffer.current, value];
    
    const recentInputs = inputBuffer.current.slice(-SECRET_CODE.length);
    if (JSON.stringify(recentInputs) === JSON.stringify(SECRET_CODE)) {
      onUnlock();
      inputBuffer.current = [];
      return;
    }

    bufferTimeoutRef.current = setTimeout(() => {
      inputBuffer.current = [];
    }, 2000);
  };

  const handleNumber = (num: string) => {
    handleInput(num);
    
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    handleInput('.');
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    handleInput(nextOperator);
    
    const inputValue = parseFloat(display);

    if (previousOperand === '') {
      setPreviousOperand(display);
    } else if (operation) {
      const currentValue = previousOperand || '0';
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousOperand(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      case '%': return firstValue % secondValue;
      default: return secondValue;
    }
  };

  const handleEqual = () => {
    handleInput('=');
    
    const inputValue = parseFloat(display);

    if (previousOperand && operation) {
      const newValue = calculate(parseFloat(previousOperand), inputValue, operation);
      setDisplay(String(newValue));
      setPreviousOperand('');
      setOperation('');
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    handleInput('AC');
    setDisplay('0');
    setPreviousOperand('');
    setOperation('');
    setWaitingForOperand(false);
  };

  const handleToggleSign = () => {
    handleInput('+/-');
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-pink-50 p-4 overflow-hidden">
      <div className="w-full max-w-md h-full max-h-[800px] flex flex-col bg-pink-100 rounded-3xl shadow-xl overflow-hidden">
        {/* Display */}
        <div className="flex-none bg-white p-6 text-right shadow-sm">
          <div className="text-pink-400 text-sm h-6 font-medium">
            {previousOperand} {operation}
          </div>
          <div className="text-slate-800 text-5xl font-bold tracking-tight truncate">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex-1 p-4 grid grid-rows-5 gap-3">
          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={handleClear}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              AC
            </Button>
            <Button
              onClick={handleToggleSign}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              +/-
            </Button>
            <Button
              onClick={() => handleOperator('%')}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              %
            </Button>
            <Button
              onClick={() => handleOperator('÷')}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              ÷
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={() => handleNumber('7')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              7
            </Button>
            <Button
              onClick={() => handleNumber('8')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              8
            </Button>
            <Button
              onClick={() => handleNumber('9')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              9
            </Button>
            <Button
              onClick={() => handleOperator('×')}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              ×
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={() => handleNumber('4')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              4
            </Button>
            <Button
              onClick={() => handleNumber('5')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              5
            </Button>
            <Button
              onClick={() => handleNumber('6')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              6
            </Button>
            <Button
              onClick={() => handleOperator('-')}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              -
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={() => handleNumber('1')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              1
            </Button>
            <Button
              onClick={() => handleNumber('2')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              2
            </Button>
            <Button
              onClick={() => handleNumber('3')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              3
            </Button>
            <Button
              onClick={() => handleOperator('+')}
              className="bg-pink-200 text-pink-700 hover:bg-pink-300 h-full rounded-2xl text-xl font-semibold transition-all active:scale-95"
            >
              +
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={() => handleNumber('0')}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm col-span-2"
            >
              0
            </Button>
            <Button
              onClick={handleDecimal}
              className="bg-white text-slate-700 hover:bg-pink-50 h-full rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm"
            >
              .
            </Button>
            <Button
              onClick={handleEqual}
              className="bg-rose-500 text-white hover:bg-rose-600 h-full rounded-2xl text-2xl font-semibold transition-all active:scale-95 shadow-lg shadow-rose-500/30"
            >
              =
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
        }
