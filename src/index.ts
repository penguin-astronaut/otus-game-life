const sum: Function = (a: number, b: number): number => a + b;

function test(x: Array<number>): number {
  return x.reduce((p, c) => c + p / 2, 0);
}

const a: number = sum(1, 2);
const b: number = sum(23, 45);

console.log(a, b);
console.log(test([2, 4, 6, 8]));
