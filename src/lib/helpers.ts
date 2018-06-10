export function isNumber(num: string | number): boolean {
  return !isNaN(Number(num));
}