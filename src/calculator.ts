import * as fs from 'fs/promises';

class Calculator {
  sum(...args: number[]): number {
    return args.reduce((acc, curr) => acc + curr, 0);
  }

  subduct(n1: number, n2: number): number {
    return n1 - n2;
  }

  multiply(...args: number[]): number {
    return args.reduce((acc, curr) => acc * curr, 1);
  }

  divide(n1: number, n2: number): number {
    if (n2 === 0) throw new Error('Cannot divide by zero');
    return n1 / n2;
  }

  async sumFromFile(filePath: string): Promise<number> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const numbers = data.split(/\s+/).map(Number).filter(num => !isNaN(num));
      return this.sum(...numbers);
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  static async writeToFile(filePath: string, data: any): Promise<void> {
    try {
      await fs.writeFile(filePath, `результат: ${data}`, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write to file: ${error.message}`);
    }
  }
}

export default Calculator;
