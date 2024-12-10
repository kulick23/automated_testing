import { describe, it, expect, beforeAll } from 'vitest';
import Calculator from '../../src/calculator';
import * as fs from 'fs/promises';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeAll(() => {
    calculator = new Calculator();
  });

  it('should sum multiple numbers', () => {
    expect(calculator.sum(1, 2, 3)).toBe(6);
    expect(calculator.sum(10, -5, 5)).toBe(10);
  });

  it('should subtract two numbers', () => {
    expect(calculator.subduct(10, 5)).toBe(5);
    expect(calculator.subduct(0, 5)).toBe(-5);
  });

  it('should multiply multiple numbers', () => {
    expect(calculator.multiply(2, 3, 4)).toBe(24);
    expect(calculator.multiply(1, 5, 0)).toBe(0);
  });

  it('should divide two numbers', () => {
    expect(calculator.divide(10, 2)).toBe(5);
  });

  it('should throw error on divide by zero', () => {
    expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('should sum numbers from a file', async () => {
    const filePath = 'test-data.txt';
    await fs.writeFile(filePath, '1 2 3 4');
    const result = await calculator.sumFromFile(filePath);
    expect(result).toBe(10);
    await fs.unlink(filePath); 
  });

  it('should write result to a file', async () => {
    const filePath = 'output.txt';
    await Calculator.writeToFile(filePath, 123);
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('результат: 123');
    await fs.unlink(filePath); 
  });
});
